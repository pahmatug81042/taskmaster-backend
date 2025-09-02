// Import the necessary modules

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the DB connection
const cors = require('cors'); // Import CORS middleware

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express application instance
const app = express();

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Placeholder route for testing
app.get('/', (req, res) => {
    res.send('TaskMaster API is running...');
});