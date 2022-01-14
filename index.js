const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
dotenv.config();
const app = express();
mongoose.connect(process.env.DATABASE , {useNewUrlParser: true}).then(() => console.log("DB connected"));
mongoose.connection.on("error", err => {
    console.log('DB connection error:' + err.message)
});
const courseRoutes = require('./routes/course');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');


app.use(morgan("test"));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use("/", courseRoutes);
app.use("/", authRoutes);
app.use("/", userRoutes);
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).json({"error":"Unauthorized"});
    }
  });
const port = process.env.PORT || 8001
app.listen(port, () => console.log('A Node Js API is listening on Port: ' + port));