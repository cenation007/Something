const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();

router.put(`/follow/:followId`, verifyUser,(req,res) => {
    User.findByIdAndUpdate(req.params.followId, {
        $push :{followers: req.user._id}
    },{new: true},
    (err,data) => {
        if(err) {
            return res.send(err);
        }
        User.findByIdAndUpdate(req.user._id, {
            $push :{following: req.params.followId}
        },{new: true})
        .then(data => {
            res.send(data);
        }).catch (err => res.json({error: err}));
    })
})

router.put(`/unfollow/:unfollowId`, verifyUser,(req,res) => {
    User.findByIdAndUpdate(req.params.unfollowId, {
        $pull :{followers: req.user._id}
    },{new: true})
    .then(data => {
        User.findByIdAndUpdate(req.user._id, {
            $pull :{following: req.params.unfollowId}
        },{new: true})
        .then(data => {
            res.send(data);
        }).catch (err => res.json({error: err}));
    })
})

module.exports = router