const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken')
var dotenv = require('dotenv');


router.put('/resetpassword',(req,res) => {
    const salt = bcrypt.genSaltSync(13);
    const hash = bcrypt.hashSync(req.body.newPass, salt)
    const {resetLink, newPass} = req.body;
    if(resetLink ) {
        jwt.verify(resetLink,process.env.RESET_PASSWORD_KEY,(err,decodedToken) => {
            if(err) {
                return res.status(401).json({error: "Incorrect token or it has expired"});
            } 
            User.findOne({resetLink},(err,user) => {
                if(!user || err) {
                    return res.status(404).json({error: "You have already used this link"});
                } 
                return user.updateOne({password: hash,resetLink:''},(err,data) => {
                    if(err) {
                        
                        res.json({error:"some error occurred :("});
                    }
                    else {
                        res.json({message:"Password changed successfully"})
                    }
                })
            }) 
            })
        }
    else {
        return res.json(401).status({error: "Authentication error"});
    }
})

module.exports = router