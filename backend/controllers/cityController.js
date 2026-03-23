const City = require("../models/City");





exports.createCity = async(req,res) => {
try{

    const { name,state } = req.body;

    if(!name){
        return res.status(400).json({
        success: false,
        message: "City name is required",
      });

    }

    const existingCity = await City.findOne({name});

      if (existingCity) {
      return res.status(400).json({
        success: false,
        message: "City already exists",
      });
    }

    const city = await City.create({
        name, 
        state
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



exports.getCities = async(req,res) => {
try{

    const cities = await City.find({isActive:true});

     return res.status(200).json({
      success: true,
      cities,
    });


}catch(error){

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