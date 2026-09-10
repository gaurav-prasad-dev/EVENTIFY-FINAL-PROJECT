const City = require("../models/City");


exports.createCity = async(req,res) => {
try{

    const { name,state } = req.body;
   
    if(!name|| !state){
        return res.status(400).json({
        success: false,
        message: "City name is required",
      });

    }
 const nameTrimmed = name.trim();
const stateTrimmed = state?.trim();

    const existingCity = await City.findOne({
  name: { $regex: new RegExp(`^${nameTrimmed}$`, "i") },
    });

      if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "City already exists",
      });
    }
    

    const city = await City.create({
        name: nameTrimmed,
  state: stateTrimmed,
      
    });

       return res.status(201).json({
      success: true,
      message: "City created successfully",
      city,
    });



}
    catch(error){

    return res.status(500).json({
      success: false,
      message: "Error creating city",
    });
 


    }
}



const DEFAULT_CITIES = [
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Delhi-NCR", state: "Delhi" },
  { name: "Bengaluru", state: "Karnataka" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Chandigarh", state: "Punjab" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Surat", state: "Gujarat" },
  { name: "Kochi", state: "Kerala" },
];

exports.getCities = async (req, res) => {
  try {
    let cities = await City.find({ isActive: true }).sort({ name: 1 });

    if (!cities || cities.length === 0) {
      try {
        await City.insertMany(
          DEFAULT_CITIES.map((c) => ({ ...c, isActive: true }))
        );
        cities = await City.find({ isActive: true }).sort({ name: 1 });
      } catch (seedErr) {
        console.log("Auto-seed error (proceeding with defaults):", seedErr.message);
        return res.status(200).json({
          success: true,
          cities: DEFAULT_CITIES.map((c, idx) => ({ ...c, _id: `default-${idx}` })),
        });
      }
    }

    return res.status(200).json({
      success: true,
      cities,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching cities",
    });
  }
};



exports.deactivateCity = async(req,res) => {
  try{

    const { cityId } = req.params;

    const city = await City.findByIdAndUpdate(
      cityId,
      {isActive: false},
      {new: true}
    );

    if(!city){
      return res.status(404).json({
        success: false,
        message: "City not found",

    })
  };

  return res.status(200).json({
      success: true,
      message: "City deactivated",
      city,
    });

  }catch(error){

        return res.status(500).json({
      success: false,
      message: "Error updating city",
    });
  

  }
}

exports.activateCity = async(req,res) => {

  try{

    const { cityId } = req.params;

    const city = await City.findByIdAndUpdate(
      cityId,
      {isActive:true},
      {new:true}
    );


    return res.json({
      success: true,
      message: "City activated",
      city
    });

  }catch(error){

      return res.status(500).json({
      success: false,
      message: "Error activating city"
    });

  }
}