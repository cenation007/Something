const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken')
var dotenv = require('dotenv');

const mailgun = require('mailgun-js');
dotenv.config();

const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});
router.put('/forgotpassword',(req,res) => {
    const email = req.body.email;
    console.log(email)
    User.findOne({email},(err,user) => {
        if(!user || err) {
            return res.status(404).json("User with this email not found");
        }
        const token = jwt.sign({_id: user._id}, process.env.RESET_PASSWORD_KEY, {expiresIn: '15m'});
        const data ={
            from: 'noreply@gmail.com',
            to: email,
            subject: 'Password Reset Mail',
            html: `
                    <h2>Click on this button to reset your password</h2>
                    <p>http://localhost:3000/forgotpassword/${token}</p>
                `
        }
            return user.updateOne({resetLink: token},(err,success) => {
                if(err) {
                    return res.status(400).json({error: "Reset Password Link error"});
                }
                mg.messages().send(data, function (error, body) {
                    if(error) 
                    return res.json({error: error})
                    res.json({message: "email succesfully sent"})
                });
            })
    })
})

module.exports = router;