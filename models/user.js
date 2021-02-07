const mongoose= require('mongoose');

const UserSchema= mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    followers: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    following: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    photo: {type:String, default: true},
    gender: {type:String},
    socketId: {type:String},
    resetLink: {type: String, default: ''}
});

mongoose.model("User",UserSchema);