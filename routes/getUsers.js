const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();


router.get(`/searchuser/:pattern`,verifyUser, (req,res) => {
    User.find({name:new RegExp('^' +req.params.pattern, 'i')})
    .select('-password')
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        res.send(err)
    })
})

router.get(`/getuserdetails/:userid`, verifyUser, (req,res) => {
    console.log("bsdk chal ja")
    User.find({_id: req.params.userid})
    .select('-password')
    .then(result => {
        res.json(result)
    })
    .catch(err => {
        res.send(err)
    })
})

module.exports = router;