require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./models/City");
const Venue = require("./models/Venue");
const Screen = require("./models/Screen");
const Show = require("./models/Show");
const Content = require("./models/Content");
const User = require("./models/User");

// Standard Seat Generator
const generateSeats = (rows = ["A", "B", "C", "D", "E", "F"], seatsPerRow = 10) => {
  const seats = [];
  rows.forEach((row, rowIndex) => {
    for (let col = 1; col <= seatsPerRow; col++) {
      seats.push({
        seatNumber: `${row}${col}`,
        row: row,
        category: rowIndex === 0 ? "Premium" : rowIndex === 1 ? "Executive" : "Standard",
      });
    }
  });
  return seats;
};

const CITIES_DATA = [
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi", state: "Delhi" },
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Noida", state: "Uttar Pradesh" },
  { name: "Gurugram", state: "Haryana" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Chennai", state: "Tamil Nadu" },
];

const VENUES_TEMPLATES = [
  {
    brand: "PVR Cinemas",
    suffix: "Grand Mall",
    street: "MG Road, Central Mall",
    area: "City Center",
    landmark: "Opposite Metro Station",
    pincode: "452001",
    amenities: ["Recliner", "Dolby", "IMAX", "Premium", "Wheelchair"],
  },
  {
    brand: "INOX Megaplex",
    suffix: "Phoenix Mall",
    street: "Ring Road Express",
    area: "Commercial Hub",
    landmark: "Near Tech Park",
    pincode: "452010",
    amenities: ["Dolby", "IMAX", "Premium", "Recliner"],
  },
  {
    brand: "Cinepolis",
    suffix: "Nexus Mega Mall",
    street: "High Street Boulevard",
    area: "West End",
    landmark: "Beside Hotel Radisson",
    pincode: "452016",
    amenities: ["Dolby", "Premium", "Recliner", "Wheelchair"],
  },
];

const SCREENS_TEMPLATES = [
  {
    name: "Audi 1 - Dolby Atmos 4K",
    rows: ["A", "B", "C", "D", "E", "F", "G"],
    seatsPerRow: 10,
    features: ["Premium"],
    sections: [
      { name: "Premium", capacity: 10 },
      { name: "Executive", capacity: 20 },
      { name: "Standard", capacity: 40 },
    ],
  },
  {
    name: "Audi 2 - IMAX Laser 3D",
    rows: ["A", "B", "C", "D", "E", "F", "G", "H"],
    seatsPerRow: 10,
    features: ["Recliner", "Premium"],
    sections: [
      { name: "Recliner", capacity: 10 },
      { name: "Prime", capacity: 20 },
      { name: "Classic", capacity: 50 },
    ],
  },
  {
    name: "Audi 3 - Luxe VIP Recliner",
    rows: ["A", "B", "C", "D", "E"],
    seatsPerRow: 8,
    features: ["Recliner", "Premium", "Wheelchair"],
    sections: [
      { name: "VIP Recliner", capacity: 40 },
    ],
  },
];

const SHOW_TIMES = [
  { start: "09:30", end: "12:15", category: "morning", price: 200, features: ["2D", "Dolby Atmos"] },
  { start: "13:00", end: "15:45", category: "afternoon", price: 250, features: ["2D", "Dolby Atmos"] },
  { start: "16:30", end: "19:15", category: "evening", price: 300, features: ["3D", "IMAX", "Dolby Atmos"] },
  { start: "20:00", end: "22:45", category: "night", price: 350, features: ["3D", "Dolby Atmos", "Recliner"] },
  { start: "23:15", end: "02:00", category: "night", price: 220, features: ["2D", "AC"] },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected successfully!");

    // 1. Get or create organizer
    let organizer = await User.findOne({ role: "organizer" });
    if (!organizer) {
      organizer = await User.findOne();
    }
    const organizerId = organizer?._id;
    console.log(`Using organizer ID: ${organizerId} (${organizer?.email || "N/A"})`);

    // 2. Ensure movies exist
    const movies = await Content.find({ type: "movie", isActive: { $ne: false } });
    if (movies.length === 0) {
      console.log("No movies found! Please ensure content is added first.");
      await mongoose.disconnect();
      return;
    }
    console.log(`Found ${movies.length} active movies:`, movies.map((m) => m.title));

    // 3. Ensure all target cities exist
    const cityDocs = [];
    for (const c of CITIES_DATA) {
      let doc = await City.findOne({
        name: { $regex: new RegExp(`^${c.name}$`, "i") },
      });
      if (!doc) {
        doc = await City.create({
          name: c.name,
          state: c.state,
          isActive: true,
        });
        console.log(`Created new city: ${c.name}`);
      } else if (!doc.isActive) {
        doc.isActive = true;
        await doc.save();
      }
      cityDocs.push(doc);
    }
    console.log(`Total cities ready: ${cityDocs.length}`);

    // 4. Generate dates for the next 7 days
    const dates = [];
    const now = new Date();
    for (let d = 0; d < 7; d++) {
      const target = new Date(now);
      target.setDate(target.getDate() + d);
      target.setHours(0, 0, 0, 0);
      dates.push(target);
    }

    let createdVenuesCount = 0;
    let createdScreensCount = 0;
    let createdShowsCount = 0;

    // 5. Iterate through each city
    for (const city of cityDocs) {
      console.log(`\n========================================`);
      console.log(`Processing city: ${city.name} (${city.state || ""})`);
      console.log(`========================================`);

      for (let vIdx = 0; vIdx < VENUES_TEMPLATES.length; vIdx++) {
        const vTemplate = VENUES_TEMPLATES[vIdx];
        const venueName = `${vTemplate.brand}: ${city.name} ${vTemplate.suffix}`;

        // Find or create Venue
        let venue = await Venue.findOne({
          name: venueName,
          city: city._id,
        });

        if (!venue) {
          venue = await Venue.create({
            name: venueName,
            city: city._id,
            type: "Theatre",
            street: vTemplate.street,
            area: `${city.name} ${vTemplate.area}`,
            landmark: vTemplate.landmark,
            pincode: vTemplate.pincode,
            amenities: vTemplate.amenities,
            status: "approved",
            createdBy: organizerId,
            isActive: true,
          });
          createdVenuesCount++;
          console.log(`  + Created Venue: ${venue.name}`);
        } else {
          console.log(`  * Existing Venue: ${venue.name}`);
        }

        // Screens for this venue
        const screenDocs = [];
        for (let sIdx = 0; sIdx < SCREENS_TEMPLATES.length; sIdx++) {
          const sTemplate = SCREENS_TEMPLATES[sIdx];
          let screen = await Screen.findOne({
            venue: venue._id,
            name: sTemplate.name,
          });

          if (!screen) {
            const seats = generateSeats(sTemplate.rows, sTemplate.seatsPerRow);
            screen = await Screen.create({
              name: sTemplate.name,
              venue: venue._id,
              totalSeats: seats.length,
              features: sTemplate.features,
              seatLayout: seats,
              sections: sTemplate.sections,
            });
            createdScreensCount++;
            console.log(`    + Created Screen: ${screen.name} (${seats.length} seats)`);
          } else {
            console.log(`    * Existing Screen: ${screen.name}`);
          }
          screenDocs.push(screen);
        }

        // 6. Create Shows for this venue and its screens
        for (let sIdx = 0; sIdx < screenDocs.length; sIdx++) {
          const screen = screenDocs[sIdx];

          // Rotate movie per screen & venue
          const movie = movies[(vIdx + sIdx) % movies.length];

          for (const showDate of dates) {
            // Create 2-3 show timings per date for this screen
            const timingsToCreate = sIdx === 0
              ? [SHOW_TIMES[0], SHOW_TIMES[2], SHOW_TIMES[3]] // Morning, Evening, Night
              : sIdx === 1
              ? [SHOW_TIMES[1], SHOW_TIMES[3], SHOW_TIMES[4]] // Afternoon, Night, Late Night
              : [SHOW_TIMES[0], SHOW_TIMES[1], SHOW_TIMES[2]]; // Morning, Afternoon, Evening

            for (const timing of timingsToCreate) {
              const existingShow = await Show.findOne({
                screen: screen._id,
                showDate: showDate,
                startTime: timing.start,
              });

              if (!existingShow) {
                // Realistic booked seats preview
                const sampleSeatNums = ["B4", "B5", "B6", "C3", "C4", "D7", "D8"];
                const count = Math.floor(Math.random() * 5) + 1;
                const randomBooked = sampleSeatNums.slice(0, count).map((s) => ({
                  seatNumber: s,
                  bookedAt: new Date(),
                }));

                await Show.create({
                  content: movie._id,
                  screen: screen._id,
                  city: city._id,
                  showDate: showDate,
                  startTime: timing.start,
                  endTime: timing.end,
                  timeCategory: timing.category,
                  basePrice: timing.price,
                  features: timing.features,
                  status: "Active",
                  approvalStatus: "approved",
                  publishedStatus: "published",
                  contentTypeSnapshot: "movie",
                  organizerId: organizerId,
                  totalSeats: screen.totalSeats,
                  bookedSeats: randomBooked,
                  pricing: [
                    { category: "Standard", price: timing.price },
                    { category: "Executive", price: timing.price + 50 },
                    { category: "Premium", price: timing.price + 100 },
                  ],
                });
                createdShowsCount++;
              }
            }
          }
        }
      }
    }

    console.log("\n========================================");
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log(`+ Venues Created:  ${createdVenuesCount}`);
    console.log(`+ Screens Created: ${createdScreensCount}`);
    console.log(`+ Shows Created:   ${createdShowsCount}`);
    console.log("========================================\n");

    const totalVenues = await Venue.countDocuments();
    const totalScreens = await Screen.countDocuments();
    const totalShows = await Show.countDocuments();
    console.log(`Current Total in Database:`);
    console.log(`- Total Venues:  ${totalVenues}`);
    console.log(`- Total Screens: ${totalScreens}`);
    console.log(`- Total Shows:   ${totalShows}`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (err) {
    console.error("SEEDING ERROR:", err);
    process.exit(1);
  }
}

seed();
