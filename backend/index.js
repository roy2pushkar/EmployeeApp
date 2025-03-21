const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middlewares/errorMiddleware");
const logger = require("./utils/logger");
const cors = require("cors");

// Initialize dotenv to load environment variables
dotenv.config();

// Create an express app instance
const app = express();

// Enable CORS before using express middlewares
const corsOptions = {
  origin: "*", // Allow all origins, change for more specific CORS policies
  methods: "GET,POST,PUT,PATCH,DELETE",
  allowedHeaders: "Content-Type, Authorization",
};

// Use CORS middleware globally
app.use(cors(corsOptions));

app.use(express.json()); // Parse JSON body
app.use(logger); // Log each request

app.use("/api/users", userRoutes); // User-related routes

app.use(errorHandler); // Error handling middleware

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
