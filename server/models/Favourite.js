const mongoose = require('mongoose');

const FavouritesSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    favourites: {
        type: Array
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('Favourites', FavouritesSchema);