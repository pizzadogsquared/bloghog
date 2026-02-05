const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        // This tracks what blogposts the user has liked, matching the auto-generated
        // _id value for the blogpost
        likes: [{_blogid: {type: String}}],
        // This tracks what blogposts the user has created, matching the auto-generated
        // _id value for the blogpost
        posts: [{_blogid: {type: String}}]
    });

const User = mongoose.model('User', userSchema);

module.exports = User;
