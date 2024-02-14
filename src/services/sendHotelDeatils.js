const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  }
});

async function sendHotelDetails(bookingData) {
  const { hotelName,checkInDate,checkOutDate,price,rating,service,adult,
    children,
    hotelroom,name,email,} = bookingData;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'Hotel Booking Confirmation - KD TRAVELS',
    html:`
      <div style="text-align: center;">
        <img src="https://iili.io/J19QQjI.png" alt="KD Travels Logo" width="100" height="100"/>
        <h2 style="text-align: center;">Hotel Booking Details</h2>
        <table border="1" cellpadding="5" cellspacing="0" style="margin: 0 auto;">
          <tr>
            <td><strong>Hotel Name:</strong></td>
            <td>${hotelName}</td>
          </tr>
          <tr>
            <td><strong>CheckIn Date:</strong></td>
            <td>${checkInDate}</td>
          </tr>
          <tr>
          <td><strong>CheckOut Date:</strong></td>
          <td>${checkOutDate}</td>
        </tr>
          <tr>
            <td><strong>Ratting :</strong></td>
            <td>${rating}</td>
          </tr>
          <tr>
            <td><strong>Seller:</strong></td>
            <td>KD TRAVELS</td>
          </tr>
          <tr>
            <td><strong>Service:</strong></td>
            <td>${service}</td>
          </tr>
          <tr>
            <td><strong>Price:</strong></td>
            <td>₹${price}/-</td>
          </tr>
          <tr>
            <td><strong>Adult:</strong></td>
            <td>${adult}</td>
          </tr>
          <tr>
            <td><strong>Children:</strong></td>
            <td>${children}</td>
          </tr>
          <tr>
            <td><strong>Booked Room:</strong></td>
            <td>${hotelroom}</td>
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
        <br>
        <h5 style="text-align: center;">Thank you for Hotel booking with KD Travels. Enjoy your day!</h5>
        <h2 style="text-align: center;">If you cancel  Flight Ticket call this Custome service Number +91 6354195682 or +91 8511017102</h2>
        <h4 style="text-align: center;">Copyright © 2023 KD  Travellers Limited (formerly known as KD Travellers Private Limited), India. All rights reserved.</h4>
        </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Hotel details sent to ${email}`);
  } catch (error) {
    console.error(`Error sending hotel details to ${email}: ${error.message}`);
  }
}

module.exports = { sendHotelDetails };
