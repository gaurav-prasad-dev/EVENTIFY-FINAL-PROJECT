const nodemailer = require("nodemailer");

const mailSender = async(email,subject,body) =>{
    try{

        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user: process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from:`"Eventify" <${process.env.MAIL_USER}>`,
            to:email,
            subject:subject,
            html:body,
        });

        return info;

    }catch(error){
console.log(error);
    }
};

module.exports = mailSender;