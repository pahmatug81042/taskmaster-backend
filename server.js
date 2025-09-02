// Import the necessary modules

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the DB connection
const cors = require('cors'); // Import CORS middleware

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();