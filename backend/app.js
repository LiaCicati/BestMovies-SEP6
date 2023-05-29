/*
Set up the Express server
*/
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
require("dotenv").config();

const routes = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

const app = express();
const url = process.env.MONGODB_URL;
const port = process.env.PORT;

// Connect to the MongoDB database
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Set up routes
app.use(routes);

// Handle validation errors
app.use(errors());

// Root URL endpoint
app.get("/", (req, res) => {
  res.status(200).send("Welcome to root URL of Server");
});

// Handle errors using the error handler middleware
app.use(errorHandler);

// Start the server
app.listen(port, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
