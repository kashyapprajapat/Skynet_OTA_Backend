const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookHotelSchema = new Schema({
  hotelName: {
    type: String,
    required: true
  },
  checkInDate: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Validate date format (DD/MM/YYYY)
        return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
      },
      message: props => `${props.value} is not a valid date!`
    }
  },
  checkOutDate: {
    type: String,
    required: true,
    validate: {
      validator: function(value) {
        // Validate date format (DD/MM/YYYY)
        return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
      },
      message: props => `${props.value} is not a valid date!`
    }
  },
  seller: {
    type: String,
    default: 'KD Travels'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  service: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be non-negative"],
  },
  adult:{
    type: Number,
    required: [true, "Adult Person is required"],
    min: [0, "Adult Person not  be non-negative"],
  },
  children:{
    type: Number,
    required: [true, "Children is required"],
    min: [0, "Children not  be non-negative"],
  },
  hotelroom:{
    type: Number,
    required: [true, "Room Number is required"],
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  }
});

const BookHotel = mongoose.model('BookHotel', bookHotelSchema);

module.exports = BookHotel;
