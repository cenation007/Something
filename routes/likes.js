const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();


router.put('/like',verifyUser,(req, res) => {
    console.log(req.user._id)
    Post.findByIdAndUpdate(req.body.postId, {
        
        $push: {likes: req.user._id}
    },{new: true})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name").then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(440).json({error: err});
    })
})

router.put('/unlike',verifyUser,(req, res) => {
    console.log(req.user._id)
    Post.findByIdAndUpdate(req.body.postId, {
        $pull: {likes: req.user._id}
    }, {new:true})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name").then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(440).json({error: err});
    })
})

module.exports = router;