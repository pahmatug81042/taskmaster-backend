const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173", // adjust for frontend deployment
        credentials: true, // allow cookies/JWT headers if needed
    })
);
app.use(helmet());
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/projects", require("./routes/projectRoutes"));
// Nested tasks under projects
app.use("/api/projects/:projectId/tasks", require("./routes/taskRoutes"));

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});