const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const url = process.env.MONGODB_URL;
const port = process.env.PORT;

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to root URL of Server");
});

app.listen(port, (error) => {
  if (!error) {
    console.log(
      "Server is Successfully Running, and App is listening on port " + port
    );
  } else {
    console.log("Error occurred, server can't start", error);
  }
});
