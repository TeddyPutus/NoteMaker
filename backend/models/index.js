const { Post } = require('./Post')
const { User } = require('./User')

Post.belongsTo(User)
User.hasMany(Post)

module.exports = {Post, User}