const mongoose = require('mongoose');
const validator = require('validator');
const Schema = mongoose.Schema;


const registerSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isMobilePhone,
      message: props => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        // Password must have at least one capital letter, one special character, and one digit
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
        return passwordRegex.test(value);
      },
      message: props => `${props.value} is not a valid password. It must have at least one capital letter, one special character, and one digit.`,
    },
  },
});



const registeruser = mongoose.model('Registration', registerSchema);

module.exports = registeruser;
