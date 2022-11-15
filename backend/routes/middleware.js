const { Router } = require("express");
const {User, Post} = require('../models/index.js');
const {validationResult} = require('express-validator');

//Middleware function that handles return errors - saves a few lines of code!
function checkErrors(req, res, next){
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        return res.status(400).send({errors: errors.array()});
    }
    else next();
}

//Middleware function that checks the user credentials 
async function checkUserID(req, res, next){
    
    const user = await User.findOne({where: {id: req.params.userID ? req.params.userID : req.body.userID}})     
    if(!user){
        return res.sendStatus(404);
    }
    else next(); //user credentials match a user
}

async function checkUserPassword(req, res, next){
   
     const user = await User.findOne({where: {id: req.params.userID ? req.params.userID : req.body.userID, password: req.params.userID ? req.params.password : req.body.password}})

    if(!user){
        return res.sendStatus(401);
    }
    else next(); //user credentials match a user
}

async function checkUsername(req, res, next){
   
    const user = User.findOne({where: {username: req.params.username ? req.params.username : req.body.username}})

   if(!user){
        return res.sendStatus(404);
   }
   else next(); //user credentials match a user
}


module.exports = {checkErrors, checkUserID, checkUserPassword, checkUsername};