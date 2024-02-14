const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  }
});

async function sendFlightTicket(bookingData) {
  const { from, to, flightClass, date, seat, price, name, email } = bookingData;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Flight Booking Confirmation. - KD TRAVELS',
    html: `
    <div style="text-align: center;">
    <img src="https://iili.io/J19QQjI.png" alt="KD Travels Logo" width="100" height="100"/>
    <h2 style="text-align: center;">Flight Booking Details</h2>
    <table border="1" cellpadding="5" cellspacing="0" style="margin: 0 auto;">
      <tr>
        <td><strong>From:</strong></td>
        <td>${from}</td>
      </tr>
      <tr>
        <td><strong>To:</strong></td>
        <td>${to}</td>
      </tr>
      <tr>
        <td><strong>Flight Class:</strong></td>
        <td>${flightClass}</td>
      </tr>
      <tr>
        <td><strong>Date:</strong></td>
        <td>${date}</td>
      </tr>
      <tr>
        <td><strong>Seat:</strong></td>
        <td>${seat}</td>
      </tr>
      <tr>
        <td><strong>Price:</strong></td>
        <td>₹${price}/-</td>
      </tr>
      <tr>
        <td><strong>Name:</strong></td>
        <td>${name}</td>
      </tr>
      <tr>
        <td><strong>Email:</strong></td>
        <td>${email}</td>
      </tr>
    </table>
    <h5 style="text-align: center;">Thank you for booking with KD Travels. Enjoy your flight!</h5>
    <h2 style="text-align: center;">If you cancel  Flight Ticket call this Custome service Number +91 6354195682 or +91 8511017102</h2>
    <h4 style="text-align: center;">Copyright © 2023 KD  Travellers Limited (formerly known as KD Travellers Private Limited), India. All rights reserved.</h4>
    </div>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Flight ticket sent to ${email}`);
  } catch (error) {
    console.error(`Error sending flight ticket to ${email}: ${error.message}`);
  }
}

module.exports = { sendFlightTicket };
