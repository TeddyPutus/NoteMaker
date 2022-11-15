const { Router } = require("express");
const {User, Post} = require('../models/index.js');
const {body, param, validationResult} = require('express-validator');
const {checkErrors, checkUserID, checkUserPassword, checkUsername, isEmailUnique, isUsernameUnique, checkUserEmail} = require('./middleware');
const userRouter = Router();


//create
userRouter.post('/',
    isEmailUnique,
    isUsernameUnique,
    body('email').isEmail().notEmpty(),
    body('password').notEmpty().isAlphanumeric().isLength({min:6}),
    body('username').isAlphanumeric().notEmpty(),
    checkErrors,
    async (req, res) => {
        try {
            const newUser = await User.create({email:req.body.email, password:req.body.password, username:req.body.username});
            console.log(`new user is ${newUser}`)
            if(newUser) res.sendStatus(200);
            else res.sendStatus(404);
        } catch (error) {
            res.status(500).send(error);
        }
    }
)

//login
userRouter.post('/login',
    checkUserEmail,
    async (req,res) => {
        try {
            const user = await User.findOne({where:{email:req.body.email}})
            if(user.isLoggedIn){
                res.sendStatus(406); //user already logged in
            } else if(user.password == req.body.password){
                await user.update({isLoggedIn: true});
                res.json(user);
            } else res.sendStatus(401); //password incorrect
        } catch (error) {
            res.status(500).send(error);
        }
    })

//logout
userRouter.post('/logout',
    checkUserEmail,
    async (req,res) => {
        try {
            const user = await User.findOne({where:{email:req.body.email}})
            if(!user.isLoggedIn){
                res.sendStatus(406); //user already logged out
            } else if(user.password == req.body.password){
                await user.update({isLoggedIn: false});
                res.json(user);
            } else res.sendStatus(401); //password incorrect
        } catch (error) {
            res.status(500).send(error);
        }
    })

//delete
userRouter.delete('/',
    checkUserEmail,
    checkUsername,
    checkErrors,
    async (req, res) => {
        try {
            const user = await User.findOne({where:{email:req.body.email, username:req.body.username}})
            if(user){
                if(user.password == req.body.password){
                    await user.destroy();
                    res.sendStatus(200)
                } else res.sendStatus(401)
            }
            else res.sendStatus(404);
        } catch (error) {
            res.status(500).send(error);
        }
    }
)

module.exports = userRouter;