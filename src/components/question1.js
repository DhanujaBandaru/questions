//          ---------1. Make a api for phone number login-----------------

//        a. Make add Customer api for customer, assume admin is adding customer ..
//          use the input params validation, code commenting, logging and check for
//          duplicates where required .

const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')

const app = express()
app.use(bodyParser.json())

// MySQL connection configuration
const connection = mysql.createConnection({
  host: 'your_host',
  user: 'your_username',
  password: 'your_password',
  database: 'your_database',
})

// API endpoint for customer creation
app.post('/api/customers', (req, res) => {
  const {name, phoneNumber, email} = req.body

  // Validate input parameters
  if (!name || !phoneNumber || !email) {
    return res
      .status(400)
      .json({message: 'Name, phone number, and email are required.'})
  }

  // Check for duplicate phone numbers
  connection.query(
    'SELECT * FROM customers WHERE phone_number = ?',
    phoneNumber,
    (error, results) => {
      if (error) {
        console.error('Error querying the database:', error)
        return res.status(500).json({message: 'Internal server error.'})
      }

      if (results.length > 0) {
        return res.status(400).json({message: 'Phone number already exists.'})
      }

      // Insert the new customer into the database
      const newCustomer = {name, phoneNumber, email}
      connection.query(
        'INSERT INTO customers SET ?',
        newCustomer,
        (error, results) => {
          if (error) {
            console.error('Error inserting customer:', error)
            return res.status(500).json({message: 'Internal server error.'})
          }

          return res
            .status(201)
            .json({message: 'Customer created successfully.'})
        },
      )
    },
  )
})

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000')
})
