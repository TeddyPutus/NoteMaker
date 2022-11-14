const { Router } = require("express");
const {User, Post} = require('../models/index.js');
const {validationResult} = require('express-validator');

//Middleware function that handles return errors - saves a few lines of code!
function checkErrors(req, res, next){
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        console.log(errors);
        console.log(req.body)
        return res.status(400).send({errors: errors.array()});
    }
    else next();
}

//Middleware function that checks the user credentials 
async function checkUserID(req, res, next){
    
    const user = await User.findOne({where: {id: req.params.userID}})     
    console.log("HELLO");
    if(!user){
        return res.sendStatus(404);
    }
    else next(); //user credentials match a user
}

async function checkUserPassword(req, res, next){
   
     const user = await User.findOne({where: {id: req.params.userID, password: req.params.password}})

    if(!user){
        return res.sendStatus(401);
    }
    else next(); //user credentials match a user
}

async function checkUsername(req, res, next){
   
    const user = User.findOne({where: {username: req.params.username}})

   if(!user){
        return res.sendStatus(404);
   }
   else next(); //user credentials match a user
}


module.exports = {checkErrors, checkUserID, checkUserPassword, checkUsername};