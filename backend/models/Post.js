//import our db, Model, DataTypes
const { db, DataTypes } = require('../db')

//Creating a User child class from the Model parent class
const Post = db.define("posts", {
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    isPrivate: DataTypes.BOOLEAN
});

//exports
module.exports = { Post }