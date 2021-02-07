const mongoose = require('mongoose');

const postSchema = new mongoose.Schema( {
    title: {type: String, required: true},
    body: {type:String, required: true},
    photo: {type:String, default: true},
    postedBy: {type: mongoose.Types.ObjectId, ref: 'User'},
    likes: [{type: mongoose.Types.ObjectId, ref: 'User'}],
    hidden: {type: Boolean, default:false},
    comments: [{text: {type: String}, postedBy: {type: mongoose.Types.ObjectId, ref: 'User'}}]
});

mongoose.model('Post', postSchema);