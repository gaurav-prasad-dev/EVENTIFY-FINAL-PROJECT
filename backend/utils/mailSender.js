const nodemailer = require("nodemailer");
const axios = require("axios");

let gmailTransporter = null;
const getGmailTransporter = () => {
  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
  }
  return gmailTransporter;
};

const mailSender = async (email, subject, body) => {
  const isProduction =
    process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const brevoSenderEmail = process.env.BREVO_SENDER_EMAIL?.trim();

  // 1️⃣ Priority: Try Brevo Transactional Email API if configured
  if (brevoApiKey && brevoApiKey !== "your_brevo_api_key" && brevoSenderEmail) {
    try {
      console.log(`Attempting to send email via Brevo API to ${email}...`);
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: process.env.BREVO_SENDER_NAME || "Eventify",
            email: brevoSenderEmail,
          },
          to: [{ email: email.trim() }],
          subject,
          htmlContent: body,
        },
        {
          headers: {
            "api-key": brevoApiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );
      console.log("✅ Email sent via Brevo API successfully");
      return response.data;
    } catch (brevoErr) {
      const errMsg =
        brevoErr.response?.data?.message ||
        brevoErr.message ||
        "Unknown Brevo error";
      const errCode = brevoErr.response?.data?.code || brevoErr.response?.status;

      console.error("❌ Brevo API Error:", errCode, errMsg);

      let helpfulMessage = errMsg;
      if (errMsg.includes("unrecognised IP address")) {
        helpfulMessage =
          "Brevo Error: Unauthorized IP address. Please open https://app.brevo.com/security/authorised_ips and click 'Deactivate' under 'Blocking unauthorized IP addresses' to allow cloud server requests.";
      } else if (errCode === 401 || errCode === "unauthorized") {
        helpfulMessage =
          "Brevo Error: Invalid or unauthorized API Key. Please verify BREVO_API_KEY in Render/environment settings.";
      } else if (errMsg.includes("sender")) {
        helpfulMessage = `Brevo Error: Sender email "${brevoSenderEmail}" must be verified in your Brevo account under Senders & IP.`;
      }

      // In production / on Render, outbound SMTP ports (25, 465, 587) are blocked by cloud firewalls.
      // Never attempt Gmail SMTP fallback on Render because it will hang and cause 45s timeouts.
      if (isProduction) {
        throw new Error(helpfulMessage);
      }

      console.warn("⚠️ Falling back to local Gmail SMTP...");
    }
  } else if (isProduction) {
    throw new Error(
      "BREVO_API_KEY or BREVO_SENDER_EMAIL is not configured in your Render environment variables. Please add them in Render Dashboard > Environment."
    );
  }

  // 2️⃣ Fallback for local development: Gmail Nodemailer
  try {
    const transporter = getGmailTransporter();

    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: body,
    });

    console.log("✅ Email sent via Gmail SMTP successfully");
    return info;
  } catch (error) {
    console.error("Mail sender error:", error.message);
    throw error;
  }
};

module.exports = mailSender;