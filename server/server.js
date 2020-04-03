const path = require("path");
require("dotenv").config(path.resolve(__dirname + ".env"));

//INIT APP
const express = require("express");
const app = express();

//ALLOW CORS
const cors = require("cors");
app.use(cors());

//CONFIG PASSPORT AND INIT
const passport = require("passport");
require("./config/passport");
app.use(passport.initialize());

//CONNECT TO MONGODB
const mongoose = require("mongoose");
mongoose
    .connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(`Failed to connect to MongoDB ${err}`));

//BODY-PARSER
app.use(express.json());
app.use(express.urlencoded());

//ROUTES HANDLER
const router = require("./routes/index");
app.use("/api", router);

//ERROR HANDLER
const errorHandler = require("./errors_handlers/errorHandler");
app.use((err, req, res, next) => {
    errorHandler(err, req, res, next);
});

//404 HANDLER
//To express, 404 is not an error
app.use((req, res, next) => {
    res.status(404).send("Not found");
});

//START LISTENING
app.listen(process.env.PORT, () => {
    console.log(`Listening to port ${process.env.PORT}`);
});
