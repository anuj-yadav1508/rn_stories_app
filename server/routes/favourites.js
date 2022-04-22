const express = require('express');
const router = express.Router();
const verify = require('../verify');
const Favourites = require('../models/Favourite');

// adding a favourite
router.post('/addingfavourite', verify, async (req, res) => {
    try {
        const favouriteId = req.body.favouriteId ;
        const userId = req.body.userId;

        const userFavourites = await Favourites.findOne({ userId: userId });

        if(userFavourites) {
            userFavourites.favourites.push(favouriteId);
            const savedAgain = await userFavourites.save();
            
            return res.status(200).json(savedAgain);
        }else {
            const newFavourites = new Favourites({
                userId: userId,
                favourites: favouriteId
            });

            const savedFavourite = await newFavourites.save();
            console.log(savedFavourite);
            return res.status(200).json(savedFavourite);
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// removing from favourites
router.post('/removingfavourite', verify, async (req, res) => {
    try {
        const userFavourites = await Favourites.findOne({ userId: req.body.userId });

        if(userFavourites.favourites.length === 1) {
            await Favourites.findOneAndDelete({ userId : req.body.userId });

            return res.json('Deleted!');
        } else {
            const updatedFavourites = await Favourites.findOneAndUpdate({ userId: req.body.userId }, { $pull: { favourites: req.body.favouriteId } }, { new: true });

            return res.status(200).json(updatedFavourites);
        }  
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// getting favourites of a particular user
router.get('/particularuser/:userId', verify, async (req, res) => {
    try {
        const userFavourites = await Favourites.findOne({ userId: req.params.userId });

        return res.status(200).json(userFavourites);
    } catch (err) {
        return res.status(500).json(err.message);        
    }
});

module.exports = router;