const mongoose = require('mongoose');

const bookedFlightSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  from: {
    type: String,
    required: [true, "From is required"],
    trim:true
  },
  to: {
    type: String,
    required: [true, "To is required"],
    trim: true,
  },
  date: {
    type: String, 
    required: true,
    validate: {
      validator: function (value) {
        // Use a regular expression to check if the date matches the expected format
        return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
      },
      message: 'Invalid date format. Please use the format DD/MM/YYYY.',
    },
  },
  seat: {
    type: Number,
    required: true,
  },
  flightClass: {
    type: String,
    enum: ["Economy", "PremiumEconomy", "Business"],
    required: [true, "Flight class is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be non-negative"],
  },
});


const BookedFlight = mongoose.model('BookedFlight', bookedFlightSchema);

module.exports = BookedFlight;
