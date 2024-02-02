// emailService.js
const nodemailer = require('nodemailer');
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL, 
    pass: process.env.NODEMAILER_PASSWORD   
  }
});


async function sendOTPEmail(toEmail,otp) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL , 
    to: toEmail,
    subject: 'OTP For Forgot Password.',
    html: `
    <p>Your OTP <strong>${otp}</strong> For Forgot password. Please, do not share it with anyone. Keep it secret.</p>
    <p>Thank you for registering with our service. Book Flights, Hotel, and Exciting Holiday packages on Budget Frandiely.</p>
    <h5>Enjoy Holidays.</h5>
    <p>Best regards,</p>
    <h3>KD Travels.</h3>`
};

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP Email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending OTP email to ${toEmail}: ${error.message}`);
  }
}

module.exports = { sendOTPEmail };
