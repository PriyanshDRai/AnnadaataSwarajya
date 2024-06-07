const express = require('express');
const mysql = require('mysql2/promise'); // Import mysql2 promise-based version
const cors = require('cors');
// require('dotenv').config(); 

const app = express();
const port = process.env.port || 3000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON data

app.use(express.static('public', { cacheControl: true }));

//Disable ETag
app.disable('etag');

// MySQL connection pool configuration
const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Mysql@123',
  database: process.env.DB_NAME || 'mandiDB'
});

// Define API endpoints
app.get('/all', async (req, res) => {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    // Execute the query
    const [results] = await connection.query('SELECT * FROM trade_data');
    // Release the connection back to the pool
    connection.release();

    // database result in format of data table
    const transformedData = results.map(row => ({
      APMC: row.apmc,
      Date: row.date,
      Commodity: row.commodity,
      Minimum_Price: row.minimum_price,
      Modal_Price: row.modal_price,
      Maximum_Price: row.maximum_price,
      Commodity_Arrival: row.commodity_arrival,
      Commodity_Traded: row.commodity_traded,
      Unit: row.unit,
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  }
});

// ADD Data routes for CRUD operations...
app.post('/addRecord', async (req, res) => {
  const { apmc, date, commodity, minimumPrice, modalPrice, maximumPrice, commodityArrival, commodityTraded, unit } = req.body;
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection();
    // Execute the query
    await connection.query('INSERT INTO trade_data (apmc, date, commodity, minimum_price, modal_price, maximum_price, commodity_arrival, commodity_traded, unit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [apmc, date, commodity, minimumPrice, modalPrice, maximumPrice, commodityArrival, commodityTraded, unit]);
    // Release the connection back to the pool
    connection.release();

    res.json({ message: 'Record added successfully' });
  } catch (error) {
    console.error('Error adding record:', error);
    res.status(500).json({ message: 'Error adding record' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
  