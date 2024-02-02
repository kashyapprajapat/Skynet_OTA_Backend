const nodemailer = require('nodemailer');
require("dotenv").config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL, 
    pass: process.env.NODEMAILER_PASSWORD   
  }
});


async function sendEmail(toEmail) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL , 
    to: toEmail,
    subject: 'Thank you for Registration -KD TRAVELS',
    text: 'Thank you for registering with our service. Book Flights,Hotel and Exiting Holiday packages\n on Budget Frandiely.\n\nEnjoy Holidays.\n\nBest regards,\n\nKD Travels.'
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${toEmail}`);
  } catch (error) {
    console.error(`Error sending email to ${toEmail}: ${error.message}`);
  }
}

module.exports = { sendEmail };
