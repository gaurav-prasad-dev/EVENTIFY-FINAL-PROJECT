const Otp = require("../models/OtpSchema");
const otpGenerator = require("otp-generator");
const mailSender = require("../utils/mailSender");
const User = require("../models/User");
const Profile = require("../models/Profile");
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require("google-auth-library");


exports.sendOtp = async(req,res) =>{
    try{

        const{email,phone} = req.body;

        if(!email && !phone){
             return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
        }

        const identifier = email || phone;

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

        await mailSender(email,
            "Your OTP for login",
            `<h1>Your OTP is ${otp}</h1>`
        );


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

        const identifier = email || phone;

        const otpRecord = await Otp.findOne({identifier});

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

    let user = await User.findOne({
        $or:[{email},{ phone }]
    });


    if(!user){
        user = await User.create({
            email,phone,
             role: "admin" 
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

    await Otp.deleteOne({_id: otpRecord._id});

      return res.status(200).json({
      success: true,
      token,
      user,
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

        const { token } = req.body;

        //Frontend sends Google token after user clicks “Login with Google”
        
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { sub: googleId, email, name, picture } = payload;

        let user = await User.findOne({googleId});

        if(!user){
            user = await User.create({
                email,
                googleId,
                isVerified:true,
            });

            await Profile.create({
                user:user._id,
                fullName: name,
                ProfileImage:picture,
                isProfileComplete:false,
            });
        }

        //generate jwt

        const jwtToken = jwt.sign(
            {id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d"}
        );

          return res.status(200).json({
      success: true,
      token: jwtToken,
      user,
    });




    }catch(error){

         return res.status(500).json({
      success: false,
      message: "Google login failed",
    });

    }
}



