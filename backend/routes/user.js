const { Router } = require("express");
const {User, Post} = require('../models/index.js');
const {body, param, validationResult} = require('express-validator');
const userRouter = Router();

///route stuff here

module.exports = userRouter;