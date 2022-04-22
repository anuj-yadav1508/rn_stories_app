const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// registering a user
router.post('/register', async (req, res) => {
    try {
        const { email } = req.body.email;

        const user = await User.findOne({ email: email });
        console.log(user);
        if(!user) {
            const salt = await bcrypt.genSalt(12);

            const hashedPassword = await bcrypt.hash(req.body.password, salt);

            const newUser = new User({...req.body, password: hashedPassword});

            const savedUser = await newUser.save();
            return res.status(200).json(savedUser);
        }else {
            return res.status(403).json('Email already registered!')
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

// login a user using email and password
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if(user) {
            const passed = await bcrypt.compare(req.body.password, user.password);

            if(passed) {
                // jwt signing
                jwt.sign({userId: user._id, userName: user.userName} , process.env.JWT_SECRET_KEY, (err, accessToken) => {
                    if(err) return res.status(403).json(err.message);

                    const { password, ...others } = user._doc;

                    return res.status(200).json({accessToken, ...others });
                })
            } else {
                return res.status(401).json('Password incorrect!');
            }
        }else {
            return res.status(402).json('Email does not exists!');
        }
    } catch (err) {
        return res.status(500).json(err.message);
    }
});

module.exports = router;