const mongoose = require('mongoose');

const holidayPackageSchema = new mongoose.Schema({
  holidayImage: {
    type: String,
    required: [true, 'Holiday image is required'],
  },
  holidayName: {
    type: String,
    required: [true, 'Holiday name is required'],
    trim: true,
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be non-negative'],
  },
});

const HolidayPackage = mongoose.model('HolidayPackage', holidayPackageSchema);

module.exports = HolidayPackage;
