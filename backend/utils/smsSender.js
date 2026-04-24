const twilio = require("twilio");

const client = twilio(
     process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

exports.sendSMS = async(phone,otp)=>{
    try{
        await client.messages.create({
            body:` Your OTP is ${otp}`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone,
        });

         console.log("SMS sent successfully");

    }catch(error){
console.error("SMS Error:", error.message);
    throw error;
    }
}