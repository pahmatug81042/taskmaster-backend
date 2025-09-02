// Import mongoose to handle MongoDB connection

const mongoose = require('mongoose');

require('dotenv').config();

// Function to connect to MongoDB
const connectDB = async () => {
    try {
        // Connect to MongoDB using the URI from the .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: Connection Host: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure if connection fails
    }
};

module.exports = connectDB;