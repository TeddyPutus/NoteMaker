const express = require("express");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const app = express();
const seed = require('./seed')
const cors = require('cors');

//very important tp include these!! We need this to read the body in our routers
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())
//set up  routers
app.use('/users', userRouter);
app.use('/posts', postRouter);

//Comment out app.listen when running supertest file

app.listen(5001, async() => {
    await seed();
    console.log('Listening on port 5001');
});

module.exports = app;