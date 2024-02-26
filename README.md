# Ota-Backend API Documentation

This repository contains the documentation for the Ota-Backend API. The API provides endpoints for various functionalities related to flight booking, hotel booking, user registration, and more.

## Base URL

The base URL for the API is `http://localhost:8080`.

## Endpoints

1. **Get all API Endpoints**
   - Method: GET
   - URL: `/`
   - Description: Fetches all available API endpoints.

2. **Register User**
   - Method: POST
   - URL: `/api/register`
   - Description: Registers a new user.
   - Body Parameters:
     - `fullName`: Full name of the user.
     - `mobileNumber`: Mobile number of the user.
     - `email`: Email address of the user.
     - `password`: Password for the user account.

3. **Login Check**
   - Method: POST
   - URL: `/api/login`
   - Description: Validates user credentials for login.
   - Body Parameters:
     - `email`: Email address of the user.
     - `password`: Password for the user account.

4. **Get all registered user details**
   - Method: GET
   - URL: `/api/getallregisteruser`
   - Description: Retrieves details of all registered users.

5. **Send OTP for forgot password**
   - Method: POST
   - URL: `/api/sendotp`
   - Description: Sends OTP to the provided email address for password reset.
   - Body Parameters:
     - `email`: Email address of the user.

6. **Update Password**
   - Method: PATCH
   - URL: `/api/updatepassword`
   - Description: Updates the password for the user.
   - Body Parameters:
     - `email`: Email address of the user.
     - `password`: New password for the user account.

7. **Add Flight Details**
   - Method: POST
   - URL: `/api/addflight`
   - Description: Adds details of a new flight.
   - Body Parameters:
     - `from`: Departure city.
     - `to`: Destination city.
     - `flightClass`: Class of the flight (e.g., Economy, Business).
     - `price`: Price of the flight.

8. **Get all flight details**
   - Method: GET
   - URL: `/api/getflights`
   - Description: Retrieves details of all available flights.

9. **Get flight details based on search**
   - Method: POST
   - URL: `/api/findflights`
   - Description: Retrieves flight details based on search criteria.
   - Body Parameters:
     - `from`: Departure city.
     - `to`: Destination city.
     - `flightClass`: Class of the flight.

10. **Delete flight details by given id**
    - Method: DELETE
    - URL: `/api/deleteflight/{flightId}`
    - Description: Deletes flight details using the provided flight ID.

11. **Update flight details**
    - Method: PATCH
    - URL: `/api/updateflight/{flightId}`
    - Description: Updates flight details using the provided flight ID.
    - Body Parameters:
      - `from`: Departure city.
      - `to`: Destination city.
      - `flightClass`: Class of the flight.
      - `price`: Price of the flight.
12. **Add Holiday Package**
    - Method: POST
    - URL: `/api/addpackagedetails`
    - Description: Adds details of a new holiday package.
    - Body Parameters:
      - `holidayImage`: Image file of the holiday package.
      - `holidayName`: Name of the holiday package.
      - `duration`: Duration of the holiday package.
      - `city`: Destination city of the holiday package.
      - `service`: Services included in the holiday package.
      - `price`: Price of the holiday package.

13. **Get All Holiday Package Detail**
    - Method: GET
    - URL: `/api/getallpackages`
    - Description: Retrieves details of all available holiday packages.

14. **Get Package by city**
    - Method: POST
    - URL: `/api/getpackagesbycity`
    - Description: Retrieves holiday packages based on the destination city.
    - Body Parameters:
      - `city`: Destination city.

15. **Update Holiday Package by id**
    - Method: PATCH
    - URL: `/api/updatepackage/{packageId}`
    - Description: Updates holiday package details using the provided package ID.
    - Body Parameters:
      - `holidayName`: Name of the holiday package.
      - `duration`: Duration of the holiday package.
      - `city`: Destination city of the holiday package.
      - `service`: Services included in the holiday package.
      - `price`: Price of the holiday package.

16. **Delete Package By its Id**
    - Method: DELETE
    - URL: `/api/deletepackage/{packageId}`
    - Description: Deletes a holiday package using the provided package ID.

17. **Book Flight After Payment Done**
    - Method: POST
    - URL: `/api/bookflight`
    - Description: Books a flight after successful payment.
    - Body Parameters:
      - `from`: Departure city.
      - `to`: Destination city.
      - `flightClass`: Class of the flight.
      - `date`: Date of the flight.
      - `seat`: Number of seats.
      - `price`: Price of the flight.
      - `name`: Name of the passenger.
      - `email`: Email address of the passenger.

18. **Send Holiday Detail After Payment Success**
    - Method: POST
    - URL: `/api/bookholiday`
    - Description: Sends details of the booked holiday after successful payment.
    - Body Parameters:
      - `holidayTitle`: Title of the holiday package.
      - `city`: Destination city.
      - `duration`: Duration of the holiday package.
      - `dateOfTravel`: Date of travel.
      - `service`: Services included in the holiday package.
      - `price`: Price of the holiday package.
      - `name`: Name of the customer.
      - `email`: Email address of the customer.

19. **Add Hotel Details**
    - Method: POST
    - URL: `/api/addhoteldetails`
    - Description: Adds details of a new hotel.
    - Body Parameters:
      - `hotelImage`: Image file of the hotel.
      - `hotelName`: Name of the hotel.
      - `rating`: Rating of the hotel.
      - `city`: City where the hotel is located.
      - `service`: Services provided by the hotel.
      - `price`: Price per night of the hotel.

20. **Get All Hotels**
    - Method: GET
    - URL: `/api/gethoteldetails`
    - Description: Retrieves details of all available hotels.

21. **Get Hotels by City**
    - Method: POST
    - URL: `/api/gethotelsbycity`
    - Description: Retrieves hotels based on the city.
    - Body Parameters:
      - `city`: City where the hotel is located.

22. **Update Hotel by ID**
    - Method: PATCH
    - URL: `/api/updatehotel/{hotelId}`
    - Description: Updates hotel details using the provided hotel ID.
    - Body Parameters:
      - `hotelName`: Name of the hotel.
      - `rating`: Rating of the hotel.
      - `city`: City where the hotel is located.
      - `service`: Services provided by the hotel.
      - `price`: Price per night of the hotel.
23. **Delete Hotel by ID**
    - Method: DELETE
    - URL: `/api/deletehotel/{hotelId}`
    - Description: Deletes a hotel using the provided hotel ID.

24. **Send Hotel Detail after Successful Payment**
    - Method: POST
    - URL: `/api/bookhotel`
    - Description: Sends details of the booked hotel after successful payment.
    - Body Parameters:
      - `hotelName`: Name of the hotel.
      - `city`: City where the hotel is located.
      - `checkInDate`: Check-in date.
      - `checkOutDate`: Check-out date.
      - `price`: Total price for the stay.
      - `rating`: Rating of the hotel.
      - `service`: Services provided by the hotel.
      - `adult`: Number of adults.
      - `children`: Number of children.
      - `hotelroom`: Number of hotel rooms.
      - `name`: Name of the customer.
      - `email`: Email address of the customer.

26. **Admin Dashboard**
    - Method: GET
    - URL: `/api/admindashboard`
    - Description: Retrieves data for the admin dashboard.

27. **Add Holiday Package**
    - Method: POST
    - URL: `/api/addpackagedetails`
    - Description: Adds details of a new holiday package.
    - Body Parameters:
      - `holidayImage`: Image file of the holiday package.
      - `holidayName`: Name of the holiday package.
      - `duration`: Duration of the holiday package.
      - `city`: City where the holiday package is available.
      - `service`: Services included in the holiday package.
      - `price`: Price of the holiday package.

28. **Get All Holiday Package Details**
    - Method: GET
    - URL: `/api/getallpackages`
    - Description: Retrieves details of all holiday packages.
29. **Get All Booked Hotel Data**
    - Method: GET
    - URL: `/api/getallbookedhotels`
    - Description: Retrieves details of all booked hotels from the database.

30. **Get All Booked Package Details**
    - Method: GET
    - URL: `/api/getallbookedpackage`
    - Description: Retrieves details of all booked holiday packages from the database.


## Response Format

The API returns responses in JSON format. Example response:

```json
{
  "status": "success",
  "data": { ... }
}

