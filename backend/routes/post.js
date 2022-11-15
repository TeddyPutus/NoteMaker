const { Router } = require("express");
const {User, Post} = require('../models/index.js');
const {body, param, validationResult} = require('express-validator');
const postRouter = Router();
const {checkErrors, checkUserID, checkUserPassword, checkUsername} = require('./middleware');

///ADD VALIDATORS!!!!!!!!!
//create a new post for the user
postRouter.post("/:userID",
    checkUserID,
    body('title').notEmpty().isLength({min:3, max: 25}),
    body('content').notEmpty().isLength({min:10, max:250}),
    body('isPrivate').notEmpty().isBoolean(),
    checkErrors,
    async (req, res) => {
        const newPost = Post.create({title:req.body.title, content:req.body.content, isPrivate:req.body.isPrivate, userId:req.params.userID});
        if(newPost) res.sendStatus(200);
    }
)

//returns all posts not set to private
postRouter.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({where:{isPrivate: false}});
        res.json(posts);
    } catch (error) {
        res.status(500).send(error);
    }
})

//returns all public posts of specified user
postRouter.get('/public/:userID',
    checkUserID,
    async (req, res) => {
        try {
            const posts = await Post.findAll({where:{userId: req.params.userID, isPrivate: false}});
            res.json(posts);
        } catch (error) {
            res.status(500).send(error);
        }
    }
)
// /posts/private/404/asdfsAS2
//returns all private posts of specified user
postRouter.get('/private/:userID/:password',
    checkUserID,
    checkUserPassword,
    async (req, res) => {
        try {
            const posts = await Post.findAll({where:{userId: req.params.userID, isPrivate: true}});
            res.json(posts);
        } catch (error) {
            res.status(500).send(error);
        }
    }
)

module.exports = postRouter;