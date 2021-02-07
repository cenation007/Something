const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();


router.put('/comment',verifyUser,(req, res) => {
    const comment = {
        text: req.body.comment,
        postedBy: req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId, {  
        $push: {comments: comment}
    },{new: true})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy', '_id name')
    .then(data => {
        return res.json(data);
    }).catch(err => {
        return res.status(440).json({error: err});
    })
})

module.exports = router;