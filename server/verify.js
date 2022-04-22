const express = require('express');
const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {

    const authHeaders = req.headers;

    if(authHeaders && authHeaders !== undefined) {
        const token = authHeaders.authorization.split(' ')[1];

        if(token) {
            jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
                if(err) return res.status(403).json('Token is not valid!');

                req.user = user;
                next();
            });
        }else {
            return res.status(401).json('Token is not provided!');
        }
    }else {
        return res.status(400).json('Please, provide headers!');
    }
};

module.exports = verify;