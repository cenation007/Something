const jwt = require('jsonwebtoken')
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req,res,next) => {
    const token = req.header('auth-token');
    if(!token) {
       return res.status(401).json({error: "access denied"}).send("Access Denied");
    } try {
    const {_id} = jwt.verify(token,process.env.JWT_secret);
    User.findById({_id})
    .then(user => {
        req.user = user;
        next();
    })
    } catch {
        res.status(400).send("envalid token");
    }
}