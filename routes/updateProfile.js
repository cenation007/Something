const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const path = require('path')
var dotenv = require('dotenv');
dotenv.config()

const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
const {updateValidation} = require('../validation')
dotenv.config();

router.put('/updateprofile',verifyUser, (req,res) => {
    console.log(req.body,"!")
    User.findOneAndUpdate({_id: req.user._id},{
            $set: {name: req.body.name, gender: req.body.gender}
    },{new: true})
    .then(data=> {res.json(data)})
    .catch(err => res.json(err))
})

router.put('/updateimage',verifyUser, (req,res) => {
    console.log(req.body,"!")
    User.findOneAndUpdate({_id: req.user._id},{
            $set: {photo: req.body.photo}
    },{new: true})
    .then(data=> {res.json(data)})
    .catch(err => res.json(err))
})

router.put('/changepassword',verifyUser, (req,res) => {
    const salt = bcrypt.genSaltSync(13);
    const hash = bcrypt.hashSync(req.body.newPass, salt)
    User.findOne({_id: req.user._id})
    .then(user => {
        if(user) {
        bcrypt.compare(req.body.oldPass,user.password)
        .then(check => {
            if(check) {
                User.findOneAndUpdate({_id: req.user._id},{$set: {password: hash}},{new:true})
                .exec((result,err) => {
                    if(result) {
                        res.send(result);
                    } else {
                        res.send(err);
                    }
                })
            } else {
                res.status(404).send("Old Password does not matches");
            }
        })
        .catch(err=> res.send(err))
    }
    }).catch(err => res.send(err))
})

const cloudinary = require('cloudinary');
cloudinary.config({
cloud_name: process.env.cloud_name,
upload_preset: 'InstaClone',
api_key: process.env.CLOUD_API_KEY,
api_secret: process.env.CLOUD_API_SECRET
});
router.post('/cloudupload',(req,res) => {
    console.log(req.body.image)
    cloudinary.v2.uploader.upload('uploads/'+req.body.image, 
    function(error, result) {
        if(result)
            return res.json(result.url);
        return res.status(403).json(error);
    });
})

module.exports = router


