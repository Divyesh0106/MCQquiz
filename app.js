const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
var cors  = require('cors');
const userRoutes = require("./routes/api/user");
const questionsRoutes = require("./routes/api/questions");
const questionsAdminRoutes = require("./routes/admin/questions");
const questionsAdminUserRoutes = require("./routes/admin/user");

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

dotenv.config({"path" : __dirname+`/env${process.env.NODE_ENV.trim()}.env`})

const app = express();

mongoose.connect(process.env.DB_CONFIGRATION, {
    useNewUrlParser: true
}, function (err) {
    if (err) console.log("db connection error : " + err);
    else console.log("Mongodb connected.....");
})
app.use(bodyParser.json());
app.use(cors());
app.use('/user',userRoutes);
app.use('/question',questionsRoutes);
app.use('/admin/question',questionsAdminRoutes)
app.use('/admin/user',questionsAdminUserRoutes)

app.listen(process.env.PORT,()=>{
    console.log("Server listening on port:",process.env.PORT)
})