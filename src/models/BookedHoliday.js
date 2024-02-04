const mongoose = require('mongoose');

const bookedHolidaySchema = new mongoose.Schema({
  holidayTitle: {
    type: String,
    required: [true, 'Holiday title is required'],
    trim: true,
  },
  city:{
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    trim: true,
  },
  dateOfTravel: {
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
  seller: {
    type: String,
    default: 'KD TRAVELS',
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
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

const BookedHoliday = mongoose.model('BookedHoliday', bookedHolidaySchema);

module.exports = BookedHoliday;
