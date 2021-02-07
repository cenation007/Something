const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken')
var dotenv = require('dotenv');

router.post('/email-activate',(req,res) => {
        jwt.verify(req.body.token,process.env.JWT_EMAIL_VERIFICATION,(err,decodedToken) => {
            if(err) {
                return res.status(401).json({error: "Incorrect token or it has expired"});
            } 
            const {email,password,name, photo} = decodedToken;
            bcrypt.hash(password,13)
            .then(hashedPassword => {
                const user= new User({
                    name,email,photo,password:hashedPassword
                })
                user.save()
                .then(user => {
                    return res.json({message: "user saved succeessfully"});
                }) 
                .catch(err => {
                    res.json({"error": err});
                })
            })
             
            })
})

module.exports = router;