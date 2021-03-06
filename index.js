const express = require('express')
const db = require('./queries')
const bodyParser = require('body-parser')
const app = express()
const port = 4000

app.use(bodyParser.json())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.post('/book-room', db.bookRoom);
app.post('/check-availability', db.checkAvailability);

app.listen(port, () => {
    console.log(`App running on port ${port}.`)
})