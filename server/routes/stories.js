const express = require('express');
const router = express.Router();
const verify = require('../verify');

const Story = require('../models/Story');

// create story
router.post('/make', verify, async (req, res) => {
    try {
        const newStory = new Story(req.body);

        const savedStory = await newStory.save();

        return res.status(200).json(savedStory);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// update a story (verify)
router.patch('/updatestory/:storyId', verify, async (req, res) => {
    
    try {
        const userId = req.body.userId;

        if(userId === req.user.userId) {
            
            const updatedStory = await Story.findByIdAndUpdate(req.params.storyId, {
                $set: req.body,
            }, {
                new: true
            });

            return res.status(200).json(updatedStory);
        }else {
            return res.status(400).json('You cannot edit this story!')
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});


// delete a story (verify)
router.delete('/deletestory/:storyId', verify, async (req, res) => {
    try {
        const userId = req.body.userId;

        if(userId === req.user.userId) {
            const deletedStory = await Story.findByIdAndDelete(req.params.storyId);

            return res.status(200).json(deletedStory);
        }else {
            return res.status(400).json('You cannot edit this story!')
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});


// get all stories
router.get('/getallstories', async (req, res) => {
    try {
        const stories = await Story.find();

        return res.status(200).json(stories);
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

module.exports = router;