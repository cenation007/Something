const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken')
const {registerValidation} = require('../validation')
const {loginValidation} = require('../validation')
const verifyUser = require('../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();
const mailgun = require('mailgun-js');
const mg = mailgun({apiKey: process.env.API_KEY, domain: process.env.DOMAIN});
router.get('/protected',verifyUser,(req,res) => {
    res.send("AUR BE LAUDE");
    console.log(req.user);
});

router.post('/signup',(req,res)=> {
    const {name,email, password, photo} = req.body;
    //const {error} = registerValidation(req.body);
    console.log(req.body)
        User.findOne({email:email})
    .then(savedUser => {
        if(savedUser) {
            console.log(savedUser)
        return res.status(403).json({"error": "Bsdk pehle se hi h ek"});
        } else {
            const token = jwt.sign({name,email,password,photo}, process.env.JWT_EMAIL_VERIFICATION,{expiresIn: '15m'})
            const data ={
                from: 'noreply@gmail.com',
                to: email,
                subject: 'Email Verification Mail',
                html: `
                        <h2>Click on this button to verify your password</h2>
                        <p>http://localhost:3000/authentication/activate/${token}</p>
                    `
            }
                    mg.messages().send(data, function (error, body) {
                        if(error) {console.log(error)
                        return res.status(400).json({error: error})}
                        res.json({message: "email succesfully sent"})
                    });
                }
                })
            }
)

router.post('/signin',(req,res) => {
    const {email,password} = req.body;
    const {error} = loginValidation(req.body);
    if(error) {
        return res.json({"error": error.details[0].message});
    }
    User.findOne({email:email})
    .then(ourUser => {
        if(ourUser) {
            bcrypt.compare(password,ourUser.password)
            .then(check => {
                if(check) {
                    const token = jwt.sign({_id: ourUser._id},process.env.JWT_secret);
                    const {id,name,email, followers, following, photo, gender} = ourUser;
                    res.header('auth-token',token).json({token,user:{id,name,email, followers, following, photo, gender}});
                }
                else {
                res.json({error: "Invalid password"});
                }
            })
            .catch(err=> {
                console.log(err);
            })
        } else{
        res.status(404).json({error:"user not found"});
        }
    })
    .catch(err => {
        console.log(err);
    })
})


module.exports = router