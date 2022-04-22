const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
    userId: {
        type: String
    },
    userName: {
        type: String
    },
    userProfilePicture: {
        type: String
    },
    title: {
        type: String
    },
    imageUrl: {
        type: String
    },
    description: {
        type: String
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Story', StorySchema);