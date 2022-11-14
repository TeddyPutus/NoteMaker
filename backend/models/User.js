//import our db, Model, DataTypes
const { db, DataTypes } = require('../db')

//Creating a User child class from the Model parent class
const User = db.define("users", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    isLoggedIn: {type: DataTypes.BOOLEAN, defaultValue: false}
});

//exports
module.exports = { User }