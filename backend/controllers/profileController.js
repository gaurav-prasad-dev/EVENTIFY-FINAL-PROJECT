const Profile = require("../models/Profile");





exports.getProfile = async(req,res) => {
    try{

        const userId = req.user.id;

        const profile = await Profile.findOne({user: userId}).populate("user");

        if(!profile){

              return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
        }

        return res.status(200).json({
      success: true,
      profile,
    });


        
    }catch(error){

          return res.status(500).json({
      success: false,
      message: "Error fetching profile",
    });



    }
}





exports.updateProfile = async(req,res) => {
    try{

        const userId = req.user.id;

        const{firstName,lastName,dob,gender,profileImage} = req.body;

        const profile = await Profile.findOne({user: userId});

        if(!profile){
            return res.status(404).json({
        success: false,
        message: "Profile not found",
      });

        }
if (firstName !== undefined) profile.firstName = firstName;
if (lastName !== undefined) profile.lastName = lastName;
if (dob !== undefined) profile.dob = dob;
if (gender !== undefined) profile.gender = gender;
if (profileImage !== undefined) profile.profileImage = profileImage;
        profile.isProfileComplete = true;


       if (
  profile.firstName &&
  profile.lastName &&
  profile.dob &&
  profile.gender
) {
  profile.isProfileComplete = true;
} else {
  profile.isProfileComplete = false;
}


        return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile,
    });


    }catch(error){

         return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
        
    }
}