const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Story = require('../models/Story');
const verify = require('../verify');

// updating the user 
router.patch('/update/:userId', verify, async (req, res) => {
    try {
        if(req.params.userId === req.user.userId) {
            const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
                userName: req.body.userName,
                profilePicture: req.body.profilePicture
            },
                { new: true }
            );

            
            const updatedStories = await Story.updateMany({ userId: req.params.userId }, {$set: { userProfilePicture : req.body.profilePicture }}, { multi: true });
            const userStories = await Story.find({ userId: req.params.userId });
            console.log(userStories);

            return res.status(200).json(updatedUser);
        } else {
            return res.status(402).json('You are not authorized to do this action!')
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});


module.exports = router;