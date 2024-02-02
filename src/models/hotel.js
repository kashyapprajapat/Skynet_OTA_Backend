const mongoose = require('mongoose');
const { Schema } = mongoose;

const hotelPackageSchema = new Schema({
  hotelImage: {
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  service: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    min: 0,
    required: true,
    trim: true,
  }
});

const HotelPackage = mongoose.model('Hotel', hotelPackageSchema);

module.exports = HotelPackage;
