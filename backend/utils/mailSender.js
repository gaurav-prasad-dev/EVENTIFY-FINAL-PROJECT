const nodemailer = require("nodemailer");
const axios = require("axios");

let gmailTransporter = null;
const getGmailTransporter = () => {
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      pool: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  return gmailTransporter;
};

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
          timeout: 5000,
        }
      );
      console.log("Email sent via Brevo API successfully");
      return response.data;
    } catch (brevoErr) {
      const errMsg = brevoErr.response?.data?.message || brevoErr.message;
      if (errMsg.includes("unrecognised IP address")) {
        console.warn(
          "⚠️ Brevo Error: IP not whitelisted. Disable 'Authorised IPs' at https://app.brevo.com/security/authorised_ips to allow cloud/local calls. → Falling back to Gmail SMTP..."
        );
      } else {
        console.warn(
          "Brevo API error:",
          errMsg,
          "→ Falling back to Gmail SMTP..."
        );
      }
    }
  }

  // 2️⃣ Fallback: Gmail Nodemailer
  try {
    const transporter = getGmailTransporter();

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