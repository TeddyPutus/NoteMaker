//import dependencies
const path = require('path') //helps us find our file easily
const fs = require('fs').promises //helps us get access to promises when dealing with seeding data into our database

//import our database [x]
//import the model that we are trying to import our data into [x]
const {db} = require('./db')
const { Post, User } = require('./models/index')


//write our seed function -> take our json file, create rows with our data into it
const seed = async () => {

    await db.sync({ force: true }); // clear out database + tables

    const postSeedPath = path.join(__dirname, 'posts.json'); //get the path to Show.json file
    const userSeedPath = path.join(__dirname, 'users.json')


    const postBuffer = await fs.readFile(postSeedPath); //asynchronously reads the content in this file
    const userBuffer = await fs.readFile(userSeedPath);

    const {postsData} = JSON.parse(String(postBuffer)); // First we convert the data from buffer into a string, then we parse the JSON so it converts from string -> object
    const {usersData} = JSON.parse(String(userBuffer));


    const PostPromises = postsData.map(post => Post.create(post)); //creates Post and puts it into our Post table
    const UserPromises = usersData.map(user => User.create(user));

    //Then here we need to loop and associate posts with a user!
    const users = await User.findAll();
    const posts = await Post.findAll();

    await users[0].addPost(posts[0]);
    await users[1].addPost(posts[1]);
                                       
    await Promise.all(PostPromises); // The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves to an array of the results of the input promises.
    await Promise.all(UserPromises)

    console.log("Posts and User database info populated!")
}

//export my seed function
module.exports = seed;