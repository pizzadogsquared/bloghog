const mongoose = require('mongoose');

const blogpostSchema = new mongoose.Schema({
    // Creator of the blogpost, must match a username in users in database
    author: {
        type: String,
        required: true,
        trim: true
    },
    // Title of the blogpost
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Time created
    time: {
        type: Date,
        default: Date.now
    },
    // This will be used to handle the routing for the URL
    route: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // Content of the blogpost
    content: {
        type: String,
        required: true
    },
    // Tags used to identify the blogpost if someone tried to search for it
    tags: {
        type: [String],
        default: []
    },
    // Used for blogposts that users are still working on but saved in database
    // False if blogpost is a draft, true if blogpost should be visible to public
    published: {
        type: Boolean,
        default: false
    },
    // Filepath to images will be stored as a string
    images: {
        type: [String],
        default: [],
        trim: true
    },
    // Array of objects containing the comments of this blogpost
    comments: [{
        user: {
            type: String,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    // Number of how many times this post was liked
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const Blogpost = mongoose.model('Blogpost', blogpostSchema);

module.exports = Blogpost;