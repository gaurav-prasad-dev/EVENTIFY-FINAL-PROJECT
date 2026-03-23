const Venue = require("../models/Venue");
const City = require("../models/City");




exports.createVenue = async(req,res) => {
    try{

        const { name,city,type, street, area, landmark, pincode, amenities } = req.body;

        const cityExists = await City.findById(city);

        if(!cityExists){
            return res.status(404).json({
        success: false,
        message: "City not found",
      });

        }

        const venue = await Venue.create({
            name, 
            city,
            type,
            street,
            area,
            landmark,
            pincode,
            amenities

        });

         return res.status(201).json({
      success: true,
      message: "Venue created successfully",
      venue,
    });





    }catch(error){

        return res.status(500).json({
      success: false,
      message: "Error creating venue",
    });


    }
}



exports.getVenueByCity = async(req,res) => {
    try{ 

        const { cityId } = req.params;

        const venues = await Venue.find({
            city:cityId,
            isActive:true
        });

          return res.status(200).json({
      success: true,
      venues,
    });



    }catch(error){

        return res.status(500).json({
      success: false,
      message: "Error fetching venues",
    });


    }
}





exports.getVenueById = async(req,res) => {

    try{

        const { id } = req.params;
        
        const venue = await Venue.findById(id).populate("city");

          if (!venue) {
      return res.status(404).json({
        success: false,
        message: "Venue not found",
      });


    }

     return res.status(200).json({
      success: true,
      venue,
    });


    }catch(error){

           return res.status(500).json({
      success: false,
      message: "Error fetching venue",
    });


    }
};


