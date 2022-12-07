const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
const hbs = require('hbs')
require('dotenv').config();
//Initialize express
const app = express();
const publicDir = path.join(__dirname, '../public')
//Initialize bodyparse
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

//Add views
hbs.registerPartials(__dirname+'/views')

app.set('view engine', 'hbs')
//I use the routes file
app.use((require("./src/routes/home")))


//I get the port from the environment variable and if not I put the default one
const port = process.env.PORT? process.env.PORT : 8080

app.listen(port, () =>{
    console.log("server started on port 3000")
})