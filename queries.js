const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Hotel',
    password: 'admin',
    port: 5433
})

const bookRoom = (request, response) => {
    const { guest, checkin_date, checkout_date, room_no } = request.body
    // Check if all the keys are present in request object
    if (!guest || !checkin_date || !checkout_date || !room_no) {
        return response.status(200).send(`Invalid request object`)
    }

    // Room number should be between 1 to 10
    if ((room_no <= 0 || room_no > 10)) {
        return response.status(200).send(`Room number not available`)
    }

    // Checkin date should be before checkout date
    if (new Date(checkin_date) > new Date(checkout_date)) {
        return response.status(200).send(`Checkout date should be post checkin date`)
    }
 
    checkRoom(checkin_date, checkout_date, room_no).then(flag => {
        // Check if room number is available to book
        if (!flag) {
            return response.status(200).send(`Room number is booked`)
        } else {
            pool.query('INSERT INTO bookings (guest, checkin_date,checkout_date,room_no) VALUES ($1, $2, $3, $4) RETURNING booking_id', [guest, checkin_date, checkout_date, room_no], (error, results) => {
                if (error) {
                    return response.status(200).send(error)
                }
                return response.status(200).send(`Your Booking id ${results.rows[0].booking_id} is now confirmed with Hotel`)
            })
        }
    })
}

var checkRoom = function(checkin_date, checkout_date, room_no) {
    return new Promise(function(resolve, reject) {
        var flag = true;
        pool.query('SELECT room_no FROM bookings WHERE (checkin_date BETWEEN $1 AND $2 OR checkout_date BETWEEN $1 AND $2) AND room_no = $3', [checkin_date, checkout_date, room_no], (error, results) => {
            if (error) {
                reject(error);
            } else {
                flag = results.rowCount == 0;
                resolve(flag);
            }
        });
    });
  }

const checkAvailability = (request, response) => {
    const { checkin_date, checkout_date } = request.body

    // Check if all the keys are present in request object
    if (!checkin_date || !checkout_date) {
        return response.status(200).send(`Invalid request object`);
    }

    pool.query('SELECT COUNT(DISTINCT room_no) FROM bookings WHERE checkin_date BETWEEN $1 AND $2 OR checkout_date BETWEEN $1 AND $2', [checkin_date, checkout_date], (error, results) => {
        if (error) {
            return response.status(200).send(`Some error occured`);
        }
        const remainingRooms = 10 - results.rows[0].count
        return response.status(200).send(`${remainingRooms} rooms available`)
    })
}

module.exports = {
    bookRoom,
    checkAvailability
}