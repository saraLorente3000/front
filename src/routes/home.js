const express = require("express");
const axios = require('axios');
const { Constants } = require("../utils/Constants");
const app = express();

require('dotenv').config();

//Return view index
app.get("/", (req, res) => {
    res.render("index")
})

//Return view list
app.get("/list", (req, res) => {
    res.render("list")
})

//Return view details
app.get("/details", (req, res) => {
    //Show page
    options = {empthy:false}
    res.render("details", options)
})

//Insert new email/newsletter
app.post("/register", (req, res)=>{
    //Sent the post insertion request
    const url = process.env.URL_SERVER + Constants.ADD
    axios.post(url, req.body)
    .then(function (response) {
        //If it went well, I show the success window
       res.render("success", response.data)
    })
    .catch(function (error) {
        //If that user / newsletter already existed, I indicate it
        let options =  error.response.status == 400?{err:"User/ newsletter already exists"}: {}
        //If it went bad, I show the error window
        res.render("err", options)
    });
})

//Get list of newsletters
app.post("/getNewsletters", (req, res)=>{
    //I create the request url to the server
    const url = process.env.URL_SERVER + Constants.GET_LIST_NEWSLETTERS +"?"+ Constants.EMAIL+`${req.body.email}`
     axios.get(url)
    .then(function (response) {
       let arrayNewsletters = []
       //I create an array with the newsletters returned from the service
       response.data.forEach(element => {
        arrayNewsletters.push(element.newsletter)
       });
       //If it went well, I show the list window with newsletters
       res.render("list",{newsletters:arrayNewsletters, emailFind: req.body.email})
    })
    .catch(function (error) {
        //If it went bad, I show the error window
        res.render("err")
    });
})

//Get details for email/newsletter
app.post("/getDetails", (req,res)=>{
    //I create the request url to the server
    const url = process.env.URL_SERVER + Constants.GET_DETAILS +"?"+Constants.EMAIL+`${req.body.email}`+"&"+Constants.GET_NEWSLETTERS+`${req.body.newsletter}`
     axios.get(url)
    .then(function (response) {
        let options = {}
        //I check if there is data for the user/newsletter entered, otherwise I show a message indicating it
        if (response.data[0]!= undefined){
            options = {gender: response.data[0].gender, birth: response.data[0].birth, name:response.data[0].name, empthy:false, email:req.body.email, newsletter:req.body.newsletter}
        }else{
            options = {empthy:true, email:req.body.email, newsletter:req.body.newsletter}
        }
          //If it went well, I show the details window 
        res.render("details", options)
    })
    .catch(function (error) {
        //If it went bad, I show the error window
        res.render("err")
    });
})

//Delete newsletter 
app.post("/deleteNewsletter", (req, res)=>{
    //Send delete request
    axios.delete(process.env.URL_SERVER + Constants.DELETE,{ data: req.body } )
    .then(function (response) {
        //I create the request url to list of newsletters
       const url = process.env.URL_SERVER + Constants.GET_LIST_NEWSLETTERS+"?"+Constants.EMAIL+`${req.body.email}`
        axios.get(url)
       .then(function (response) {
          let arrayNewsletters = []
          //I create an array with the newsletters returned from the service
          response.data.forEach(element => {
           arrayNewsletters.push(element.newsletter)
          });
          //If it went well, I show the list window 
          res.render("list",{newsletters:arrayNewsletters, emailFind: req.body.email})
       })
       .catch(function (error) {
            //If it went bad, I show the error window
           res.render("err")
       });
    })
    .catch(function (error) {
        //If it went bad, I show the error window
        res.render("err")
    });
})


module.exports = app;