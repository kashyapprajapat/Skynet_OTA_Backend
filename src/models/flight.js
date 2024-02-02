const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema({
  from: {
    type: String,
    required: [true, "From is required"],
    trim: true,
  },
  to: {
    type: String,
    required: [true, "To is required"],
    trim: true,
  },
  date: {
    type: Date,
    default: Date.now,
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

flightSchema.virtual('formattedDate').get(function () {
    const day = this.date.getDate();
    const month = this.date.getMonth() + 1;
    const year = this.date.getFullYear();
    return `${day}/${month}/${year}`;
});


const Flight = mongoose.model("Flight", flightSchema);

module.exports = Flight;
