const nodemailer = require("nodemailer");
const axios = require("axios");

let brevoSmtpTransporter = null;
let gmailTransporter = null;

const getBrevoSmtpTransporter = (user, pass, host = "smtp-relay.brevo.com", port = 587) => {
  if (!brevoSmtpTransporter) {
    brevoSmtpTransporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: false, // STARTTLS
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
      auth: {
        user,
        pass,
      },
    });
  }
  return brevoSmtpTransporter;
};

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

  // Brevo SMTP configuration (Priority A)
  const brevoSmtpPass =
    process.env.BREVO_SMTP_PASS?.trim() ||
    (process.env.BREVO_API_KEY?.trim()?.startsWith("xsmtpsib")
      ? process.env.BREVO_API_KEY.trim()
      : null);
  const brevoSmtpUser =
    process.env.BREVO_SMTP_USER?.trim() ||
    process.env.BREVO_LOGIN?.trim() ||
    "a7e3c7001@smtp-brevo.com";
  const brevoSenderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    process.env.MAIL_USER?.trim() ||
    "gkprasad264@gmail.com";
  const brevoSenderName = process.env.BREVO_SENDER_NAME || "Eventify";

  // 1️⃣ Priority A: Brevo SMTP Relay
  if (brevoSmtpPass) {
    try {
      console.log(`Attempting to send email via Brevo SMTP to ${email}...`);
      const transporter = getBrevoSmtpTransporter(
        brevoSmtpUser,
        brevoSmtpPass,
        process.env.BREVO_SMTP_HOST || "smtp-relay.brevo.com",
        process.env.BREVO_SMTP_PORT || 587
      );

      const info = await transporter.sendMail({
        from: `"${brevoSenderName}" <${brevoSenderEmail}>`,
        to: email.trim(),
        subject,
        html: body,
      });

      console.log("✅ Email sent via Brevo SMTP successfully:", info.response);
      return info;
    } catch (smtpErr) {
      console.error("❌ Brevo SMTP Error:", smtpErr.message);
      console.warn("⚠️ Falling back to next mailer method...");
    }
  }

  // 1️⃣ Priority B: Brevo REST API (if REST API key xkeysib provided)
  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  if (brevoApiKey && brevoApiKey.startsWith("xkeysib") && brevoSenderEmail) {
    try {
      console.log(`Attempting to send email via Brevo REST API to ${email}...`);
      const response = await axios.post(
        "https://api.brevo.com/v3/smtp/email",
        {
          sender: {
            name: brevoSenderName,
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
        brevoErr.response?.data?.message || brevoErr.message || "Brevo API error";
      console.error("❌ Brevo API Error:", errMsg);
      console.warn("⚠️ Falling back to Gmail SMTP...");
    }
  }

  // 2️⃣ Fallback: Gmail Nodemailer
  try {
    const transporter = getGmailTransporter();

    const info = await transporter.sendMail({
      from: `"Eventify" <${process.env.MAIL_USER}>`,
      to: email.trim(),
      subject,
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