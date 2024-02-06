const express = require("express");
const app = express();
const cors = require("cors");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");
const { generateOTP } = require("otpcaptchagenerator");
const { sendEmail } = require("./services/emailService.js");
const { sendOTPEmail } = require("./services/sendOtpEmail.js");
const { sendFlightTicket } = require("./services/sendFlightTicket.js");
const { sendHolidayDetails } = require("./services/sendPackageDeatils.js");
const { sendHotelDetails } = require("./services/sendHotelDeatils.js");
const imageUploadService = require("./services/ImageUploadService.js");
const hotelimageuploadService = require("./services/hotelimageuploadService.js");

require("dotenv").config();
const PORT = process.env.PORT || 6000;
require("./db/conn");

const registeruser = require("./models/registration");
const Flight = require("./models/flight.js");
const HolidayPackage = require("./models/holiday.js");
const BookedFlight = require("./models/BookedFlights.js");
const BookedHoliday = require("./models/BookedHoliday.js");
const hotel = require("./models/hotel.js");
const BookHotel = require("./models/BookedHotel.js");



app.use(cors());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.send("Backend is completely Working 🎉");
});

//Register user
app.post("/api/register", async (req, res) => {
  try {
    const newreg = await new registeruser(req.body);
    console.log(newreg);
    const saveuser = await newreg.save();
    const userEmail = req.body.email; // Assuming email is a field in your registration data
    await sendEmail(userEmail);
    console.log("email send succesfully");
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Registration failed" });
  }
});

//Get all data of Register user
app.get("/api/getallregisteruser", async (req, res) => {
  try {
    const allUsers = await registeruser.find({}, { password: 0 });
    res.status(200).json(allUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//login user and send jwt token
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const useremail = await registeruser.findOne({ email });
    const userpass = await registeruser.findOne({ password });
    if (!useremail) {
      return res.status(401).json({ error: "Invalid Email" });
    }
    if (!userpass) {
      return res.status(401).json({ error: "Invalid Password" });
    }
    const token = jwt.sign(
      { userId: registeruser._id },
      process.env.JWTSECRETKEY,
      { expiresIn: '2m' } 
    );

    res.status(200).json({ message: "Login  successfully.", token: token });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Login failed." });
  }
});

//Forgot password,otp send on email.
app.post("/api/sendotp", async (req, res) => {
  try {
    const { email } = req.body;

    const useremail = await registeruser.findOne({ email });
    if (!useremail) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    const otp = generateOTP(4);
    await sendOTPEmail(email, otp);

    res
      .status(200)
      .json({ message: "OTP sent successfully", frontendotp: otp });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//Update Password of register user
app.patch("/api/updatepassword", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await registeruser.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Email" });
    }

    user.password = password;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//========================================= FLIGHT SECTION API ======================================//

//Add flight Details   -CREAT
app.post("/api/addflight", async (req, res) => {
  try {
    const { from, to, flightClass, price } = req.body;

    // Validate required fields
    if (!from || !to || !flightClass || !price) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Create a new flight instance using the Flight model
    const newFlight = new Flight({
      from,
      to,
      flightClass,
      price,
    });

    // Save the new flight instance to the database
    const savedFlight = await newFlight.save();
    console.log(savedFlight);
    res
      .status(201)
      .json({ success: true, message: "flight details added Sucessfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Get all flight details  -READ
app.get("/api/getflights", async (req, res) => {
  try {
    const flights = await Flight.find().lean().exec(); // Use lean() to get a plain JavaScript object

    // Iterate through flights and replace date with formatted date
    const flightsWithFormattedDate = flights.map((flight) => {
      return {
        ...flight,
        date: flight.date.toLocaleDateString("en-US"), // Use toLocaleDateString() for formatting
      };
    });

    res.status(200).json({ flights: flightsWithFormattedDate });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Get flight details based on search
app.post("/api/findflights", async (req, res) => {
  try {
    const { from, to, flightClass } = req.body;

    // Validate required fields
    if (!from || !to || !flightClass) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    // Find flights with the provided criteria
    const matchingFlights = await Flight.find({
      from,
      to,
      flightClass,
    })
      .lean()
      .exec(); // Use lean() to get a plain JavaScript object

    res.status(200).json({ success: true, flights: matchingFlights });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Update Flight details by idin url and data in body -UPDATE
app.patch("/api/updateflight/:id", async (req, res) => {
  try {
    const { from, to, flightClass, price } = req.body;

    // Find the flight by ID and update its fields
    const updatedFlight = await Flight.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          from,
          to,
          flightClass,
          price,
        },
      },
      { new: true }
    );

    if (!updatedFlight) {
      return res
        .status(404)
        .json({ success: false, error: "Flight not found" });
    }

    res.status(200).json({ success: true, message: "Flight details updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

//Delete Flight by given id -DELETE
app.delete("/api/deleteflight/:id", async (req, res) => {
  try {
    // Find the flight by ID and delete it
    const deletedFlight = await Flight.findByIdAndDelete(req.params.id);

    if (!deletedFlight) {
      return res
        .status(404)
        .json({ success: false, error: "Flight not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Flight Deleted sucessfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint to send flight ticket after sucessfully payment
app.post("/api/bookflight", async (req, res) => {
  try {
    const { name, email, from, to, date, seat, flightClass, price } = req.body;

    const newBooking = new BookedFlight({
      name,
      email,
      from,
      to,
      date,
      seat,
      flightClass,
      price,
    });

    await newBooking.save();

    // Send flight details email to the user
    await sendFlightTicket({
      name,
      email,
      from,
      to,
      date,
      seat,
      flightClass,
      price,
    });

    res
      .status(200)
      .json({ success: true, message: "Flight booked successfully" });
  } catch (error) {
    console.error("Error booking flight:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint to get all booked flight data
app.get("/api/getallbookedflightdata", async (req, res) => {
  try {
    // Fetch all booked flight data from the database
    const bookedFlights = await BookedFlight.find({});
    res.json({ success: true, bookedFlights });
  } catch (error) {
    console.error('Error fetching booked flight data:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch booked flight data' });
  }
});

//========================================= HOLIDAYPACKAGE SECTION API ======================================//


// Add HolidayPackage Detail --CREATE
app.post("/api/addpackagedetails",imageUploadService.single("holidayImage"),async (req, res) => {
    try {
      const result = req.file.path;

      if (!result) {
        return res
          .status(400)
          .json({ success: false, error: "Holiday image is required" });
      }

      // Create a new holiday package with the file URL
      const newHolidayPackage = await HolidayPackage.create({
        holidayImage: result,
        holidayName: req.body.holidayName,
        duration: req.body.duration,
        city: req.body.city,
        service: req.body.service,
        price: req.body.price,
      });

      console.log("New Holiday Package:", newHolidayPackage);

      res
        .status(201)
        .json({ success: true, message: "Package Added Sucessfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// Get all holiday packages  --READ
app.get("/api/getallpackages", async (req, res) => {
  try {
    const allHolidayPackages = await HolidayPackage.find();
    res
      .status(200)
      .json({ success: true, holidayPackages: allHolidayPackages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get holiday packages by city   --SEARCH
app.post("/api/getpackagesbycity", async (req, res) => {
  try {
    const city = req.body.city;

    const packagesByCity = await HolidayPackage.find({ city: city });

    if (packagesByCity.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No holiday packages found for the specified city",
      });
    }

    res.status(200).json({ success: true, holidayPackages: packagesByCity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update holiday package by ID    --UPDATE
app.patch("/api/updatepackage/:id", async (req, res) => {
  try {
    const packageId = req.params.id;

    // Check if the package with the given ID exists
    const existingPackage = await HolidayPackage.findById(packageId);
    if (!existingPackage) {
      return res
        .status(404)
        .json({ success: false, error: "Holiday package not found" });
    }

    // Update the existing package with the new data
    existingPackage.holidayName =
      req.body.holidayName || existingPackage.holidayName;
    existingPackage.duration = req.body.duration || existingPackage.duration;
    existingPackage.city = req.body.city || existingPackage.city;
    existingPackage.service = req.body.service || existingPackage.service;
    existingPackage.price = req.body.price || existingPackage.price;

    // Save the updated package
    const updatedPackage = await existingPackage.save();

    res
      .status(200)
      .json({ success: true, message: "Package Updated Suceesfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Delete holiday package by ID    --DELETE
app.delete("/api/deletepackage/:id", async (req, res) => {
  try {
    const packageId = req.params.id;

    // Check if the package with the given ID exists
    const existingPackage = await HolidayPackage.findById(packageId);
    if (!existingPackage) {
      return res
        .status(404)
        .json({ success: false, error: "Holiday package not found" });
    }

    // Remove the package from the database
    const deletedPackage = await HolidayPackage.deleteOne({ _id: packageId });

    if (deletedPackage.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Holiday package Deleted successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete holiday package" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint for snding package deatil After PAYMENT sucess
app.post("/api/bookholiday", async (req, res) => {
  try {
    const {
      holidayTitle,
      city,
      duration,
      dateOfTravel,
      seller,
      service,
      price,
      name,
      email,
    } = req.body;

    const newBooking = new BookedHoliday({
      holidayTitle,
      city,
      duration,
      dateOfTravel,
      seller,
      service,
      price,
      name,
      email,
    });

    await newBooking.save();

    await sendHolidayDetails({
      holidayTitle,
      duration,
      dateOfTravel,
      seller,
      service,
      price,
      name,
      email,
    });

    res
      .status(201)
      .json({ success: true, message: "Package booked successfully" });
  } catch (error) {
    console.error("Error booking holiday:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint to get all booked hotel data 
app.get('/api/getallbookedhotels', async (req, res) => {
  try {
    // Fetch all booked hotels from the database
    const bookedHotels = await BookHotel.find();
    res.json(bookedHotels);
  } catch (error) {
    console.error('Error fetching booked hotels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//========================================= HOTEL SECTION API ======================================//


// Add Hotel Detail --CREATE
app.post("/api/addhoteldetails",hotelimageuploadService.single("hotelImage"),async (req, res) => {
    try {
      const result = req.file.path;
      if (!result) {
        return res
          .status(400)
          .json({ success: false, error: "Hotel image is required" });
      }

      // Create a new hotel with the file URL
      const newHotel = await hotel.create({
        hotelImage: result,
        hotelName: req.body.hotelName,
        rating: req.body.rating,
        city: req.body.city,
        service: req.body.service,
        price: req.body.price,
      });

      console.log("New Hotel =>:",newHotel);

      res
        .status(201)
        .json({ success: true, message: "Hotel Detail Added Sucessfully." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  }
);

// Get All Hotels Details --READ
app.get("/api/gethoteldetails", async (req, res) => {
  try {
    const hotels = await hotel.find();
    res.status(200).json({ success: true, hotels });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Get Hotels by City -- READ
app.post("/api/gethotelsbycity", async (req, res) => {
  try {
    const { city } = req.body;
    if (!city) {
      return res.status(400).json({ success: false, error: "City parameter is required" });
    }

    const hotels = await hotel.find({ city });

    res.status(200).json({ success: true, hotels });
  } catch (error) {
    
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Update Hotel by ID -- UPDATE
app.patch("/api/updatehotel/:id", async (req, res) => {
  try {
    const hotelId = req.params.id;

    const existingHotel = await hotel.findById(hotelId);
    if (!existingHotel) {
      return res
        .status(404)
        .json({ success: false, error: "Hotel not found" });
    }

    existingHotel.hotelName = req.body.hotelName || existingHotel.hotelName;
    existingHotel.rating = req.body.rating || existingHotel.rating;
    existingHotel.city = req.body.city || existingHotel.city;
    existingHotel.service = req.body.service || existingHotel.service;
    existingHotel.price = req.body.price || existingHotel.price;


    const updatedHotel = await existingHotel.save();

    res
      .status(200)
      .json({ success: true, message: "Hotel Updated Successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// Delete Hotel by ID -- DELETE
app.delete("/api/deletehotel/:id", async (req, res) => {
  try {
    const hotelId = req.params.id;

    // Check if the hotel with the given ID exists
    const existingHotel = await hotel.findById(hotelId);
    if (!existingHotel) {
      return res
        .status(404)
        .json({ success: false, error: "Hotel not found" });
    }

    // Remove the hotel from the database
    const deletedHotel = await hotel.deleteOne({ _id: hotelId });

    if (deletedHotel.deletedCount === 1) {
      res.status(200).json({
        success: true,
        message: "Hotel Deleted Successfully",
      });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to delete hotel" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint to send hotel detail after sucessfully payment
app.post("/api/bookhotel", async (req, res) => {
  try {
    const {
      hotelName,
      city,
      checkInDate,
      checkOutDate,
      price,
      rating,
      service,
      adult,
      children,
      hotelroom,
      name,
      email,
    } = req.body;

    const newBooking = new BookHotel({
      hotelName,
      city,
      checkInDate,
      checkOutDate,
      price,
      rating,
      service,
      adult,
      children,
      hotelroom,
      name,
      email,
    });


    await newBooking.save();
    
    await sendHotelDetails({
      hotelName,
      checkInDate,
      checkOutDate,
      price,
      rating,
      service,
      adult,
      children,
      hotelroom,
      name,
      email,
    });


    res.status(201).json({ success: true, message: "Hotel booked successfully" });
  } catch (error) {
    console.error("Error booking hotel:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// API endpoint to get all booked package details
app.get('/api/getallbookedpackage', async (req, res) => {
  try {
    // Fetch all booked holiday packages from the database
    const bookedPackages = await BookedHoliday.find();
    res.json(bookedPackages);
  } catch (error) {
    console.error('Error fetching booked holiday packages:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================================  DASHBOARD =============================================//

app.get('/api/admindashboard', async (req, res) => {
  try {
    
    //flight
    const bookedFlights = await BookedFlight.find();
    const totalflightbookingprice = bookedFlights.reduce((total, flight) => total + flight.price, 0);
    const totalEconomyBook = bookedFlights.filter(flight => flight.flightClass === 'Economy').length;
    const totalBusinessBook = bookedFlights.filter(flight => flight.flightClass === 'Business').length;
    const totalPremiumEconomyBook = bookedFlights.filter(flight => flight.flightClass === 'PremiumEconomy').length;

   //hotel
    const bookedHotels = await BookHotel.find();
    const totalHotelbookingPrice = bookedHotels.reduce((total, hotel) => total + hotel.price, 0);
    const totalBookedHotelsPerCity = bookedHotels.reduce((acc, hotel) => {
      acc[hotel.city] = (acc[hotel.city] || 0) + 1;
      return acc;
    }, {});

    //holiday
    const bookedHolidays = await BookedHoliday.find();
    const totalHolidayBookingPrice = bookedHolidays.reduce((total, holiday) => total + holiday.price, 0);
    const totalBookedHolidaysPerCity = bookedHolidays.reduce((acc, holiday) => {
      acc[holiday.city] = (acc[holiday.city] || 0) + 1;
      return acc;
    }, {});


    res.json({
      success: true,
      totalFlightBook: bookedFlights.length,
      totalflightbookingprice,
      totalEconomyBook,
      totalBusinessBook,
      totalPremiumEconomyBook,
      totalHotelbookingPrice,
      totalBookedHotelsPerCity,
      totalHolidayBookingPrice,
      totalBookedHolidaysPerCity
    });
  } catch (error) {
    console.error('Error fetching booked flights:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});






app.listen(PORT, () => {
  console.log(`Server is SuccessFully Running at Port No:${PORT}`);
});
