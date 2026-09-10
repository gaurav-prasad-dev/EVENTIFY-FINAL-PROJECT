const nodemailer = require("nodemailer");
const axios = require("axios");

const mailSender = async (email, subject, body) => {
  // 1️⃣ Priority: Try Brevo Transactional Email API if configured
  if (
    process.env.BREVO_API_KEY &&
    process.env.BREVO_API_KEY !== "your_brevo_api_key" &&
    process.env.BREVO_SENDER_EMAIL
  ) {
    try {
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: "Eventify",
            email: process.env.BREVO_SENDER_EMAIL,
          },
          to: [{ email }],
          subject,
          htmlContent: body,
        },
        {
          headers: {
            "api-key": process.env.BREVO_API_KEY.trim(),
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("Email sent via Brevo API successfully");
      return response.data;
    } catch (brevoErr) {
      console.warn(
        "Brevo API error:",
        brevoErr.response?.data?.message || brevoErr.message,
        "→ Falling back to Gmail SMTP..."
      );
    }
  }

  // 2️⃣ Fallback: Gmail Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: body,
    });

    console.log("Email sent via Gmail SMTP successfully");
    return info;
  } catch (error) {
    console.error("Mail sender error:", error.message);
    throw error;
  }
};

module.exports = mailSender;