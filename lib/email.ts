import nodemailer from "nodemailer";
import { EmailTemplate } from "./email-templates";

// Configure the email transporter
// User must provide EMAIL_USER and EMAIL_PASS in .env.local
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendVerificationEmail = async (to: string, code: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials missing. OTP will NOT be sent.");
    console.log(`[DEV MODE] OTP for ${to}: ${code}`); // Fallback for dev
    return;
  }

  const mailOptions = {
    from: `"AgroNova Secure Login" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Your AgroNova Verification Code: ${code}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h1 style="color: #16a34a;">AgroNova</h1>
        <p>Hello Farmer,</p>
        <p>Your secure login verification code is:</p>
        <div style="background: #f0fdf4; border: 1px solid #16a34a; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #16a34a; border-radius: 8px; width: fit-content;">
          ${code}
        </div>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this code, please ignore this email.</p>
        <br>
        <p style="font-size: 12px; color: #666;">AgroNova Platform Platform © 2024</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅  Email sent to ${to}`);
  } catch (error) {
    console.error("❌  Error sending email:", error);
    throw new Error("Failed to send verification email.");
  }

};

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️  Email credentials missing. Password reset email will NOT be sent.");
    console.log(`[DEV MODE] Reset Link for ${to}: ${resetLink}`);
    return;
  }

  const mailOptions = {
    from: `"AgroNova Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Reset Your AgroNova Password",
    html: EmailTemplate.ResetPassword(resetLink),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅  Password reset email sent to ${to}`);
  } catch (error) {
    console.error("❌  Error sending password reset email:", error);
    throw new Error("Failed to send password reset email.");
  }
};
