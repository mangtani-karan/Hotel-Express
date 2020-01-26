# Hotel Booking system
 Steps to run
 - Install postgresql
    https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
 - Create database 'Hotel'
 - Create Table
    ```
    	CREATE TABLE bookings(
    	booking_id SERIAL PRIMARY KEY,
   		guest VARCHAR(256),
			checkin_date DATE NOT null,
     	checkout_date DATE NOT null,
     	room_no INTEGER NOT null
		);
- `npm install`
- `npm start`

# API's
- Check availibility of room
  Endpoint- `/check-availability`
  Request object- `{
    "checkin_date":"1-1-2020","checkout_date":"1-5-2020"
  }`
- Book Room
  Endpoint- `/book-room`
  Request object- `{
    "guest":"Tom", "checkin_date":"1-1-2020","checkout_date":"1-5-2020","room_no":8
  }`
