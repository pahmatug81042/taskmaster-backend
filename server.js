// Import the necessary modules

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Import the DB connection
const cors = require('cors'); // Import CORS middleware

const taskRoutes = require('./routes/api/taskRoutes');
const projectRoutes = require('./routes/api/projectRoutes');
const userRoutes = require('./routes/api/userRoutes');

// Load environment variables from the .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Create Express application instance
const app = express();

// Middleware
app.use(express.json()); // Body parser middleware to parse JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

// Mount routes
app.use('/api/projects', projectRoutes);
app.use('/api/projects/:projectId/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Placeholder route for testing
app.get('/', (req, res) => {
    res.send('TaskMaster API is running...');
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});