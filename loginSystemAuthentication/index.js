'use strict';

require("dotenv").config();

const express = require("express");
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require("./configs/db.config.js");
const userRouter = require("./routers/user.routes.js");

// here we create an instance of the express
const app = express();

// here we use a 3rd-party middleware.
app.use(cors());
app.use(express.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// here we connect a database connection
const DATABASE_URL = process.env.DB_URL;
connectDB(DATABASE_URL); 

const port = process.env.PORT || 3005;

// here we include the users related all routes.
app.use("/api", userRouter);

app.listen(port, (err, res)=>{
    if(err) throw(err);
    console.log(`server is running on http://127.0.0.1:${port}`);
});