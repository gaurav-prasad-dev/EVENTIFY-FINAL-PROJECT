const Otp = require("../models/OtpSchema");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");
const { sendSMS } = require("../utils/smsSender");

exports.sendOtp = async(req,res) =>{
    try{

        const{email,phone} = req.body;

        if(!email && !phone){
             return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
        }

        const identifier = email || `+91${phone}`;

        const existingOtp = await Otp.findOne({ identifier });
        if(existingOtp && existingOtp.expiresAt > new Date()){
            return res.status(400).json({
                success:false,
                message:"OTP already sent. please wait"
            })
        }
        await Otp.deleteMany({ identifier });

        const otp = otpGenerator.generate(6,{
                 upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
        });

        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await Otp.create({
            identifier,
            otp,
            expiresAt,
        });

        if(email){
             await mailSender(email,
            "Your OTP for login",
            `<h1>Your OTP is ${otp}</h1>`
        );

        }else{
             
        await sendSMS(identifier , otp);
        }

       


          return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
    }catch(error){

        return res.status(500).json({
      success: false,
      message: "Error sending OTP",
    });
    }
}



exports.verifyOtp = async(req,res) =>{
    try{

        const{email,phone,otp} = req.body;

        const identifier = email || `+91${phone}`;

        const otpRecord = await Otp.findOne({ identifier });

        if(!otpRecord){
            return res.status(400).json({
                 success: false,
        message: "OTP not found",
            });
        }

        if(otpRecord.otp !== otp){
               return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
        }

        if(otpRecord.expiresAt < new Date()){
             return res.status(400).json({
        success: false,
        message: "OTP expired",
        });
    }

    //chech if user exist
const query = email ? { email } : { phone: identifier };
    let user = await User.findOne(query);


    if(!user){
        user = await User.create({
            email: email || undefined,
            phone: phone ? identifier : undefined,

             role: "User" 
        });
    

    await Profile.create({
        user:user._id,
    })

}

    //jwt token

    const token = jwt.sign(
        {
            id: user._id,// payload (data inside token)
            role: user.role,
        },
        process.env.JWT_SECRET,

        { expiresIn:"7d"}
    );

    //delete otp after use
    res.cookie("token", token,{
        httpOnly: true,
        secure:false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

    })

    await Otp.deleteOne({_id: otpRecord._id});

      return res.status(200).json({
      success: true,
      user,
      token,
    });



    }catch(error){

          return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });

    }
}



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//This connects your backend with Google Auth system
exports.googleLogin = async(req,res) =>{
    try{

        const { token: googleToken } = req.body;

        //Frontend sends Google token after user clicks “Login with Google”
        
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({email});

        if (user) {
  // If user exists but no googleId, link it
  if (!user.googleId) {
    user.googleId = googleId;
    await user.save();
  }
} else {
  // Create new user
  user = await User.create({
    email,
    googleId,
    isVerified: true,
  });

  await Profile.create({
    user: user._id,
    fullName: name,
    ProfileImage: picture,
    isProfileComplete: false,
  });
}
        // if(!user){
        //     user = await User.create({
        //         email,
        //         googleId,
        //         isVerified:true,
        //     });

        //     await Profile.create({
        //         user:user._id,
        //         fullName: name,
        //         ProfileImage:picture,
        //         isProfileComplete:false,
        //     });
        // }

        //generate jwt

        const jwtToken = jwt.sign(
            {id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );
          //delete otp after use
    res.cookie("token", jwtToken,{
        httpOnly: true,
        secure:true,
        sameSite: "none",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days

    })


          return res.status(200).json({
      success: true,
   
      user,
      token: jwtToken,
    });




    }catch(error){

         return res.status(500).json({
      success: false,
      message: error.message,
    });

    }
}

exports.logout = async(req,res) => {
    try{

      res.clearCookie("token", {
    httpOnly: true,
    secure: false,      // true in production
    sameSite: "lax",
  });

        return res.status(200).json({
            success:true,
            message: "Logged Out Successfully",
        });

    }catch(error){

        return res.status(500).json({
      success: false,
      message: "Logout failed",
    });

    }
}

// exports.getMe = async(req,res) => {
//   try{

//     const user = await User.findById(req.user.id).select("-password");


//     return res.status(200).json({
//       success: true,
//       user,
//     });

//   }catch(error){
//     return res.status(500).json({
//       success: false,
//       message: "Error fetching user",
//     });

//   }
// }