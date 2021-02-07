const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema( {
    toUserId: {type: mongoose.Types.ObjectId, ref: 'User'},
    message: {type: String, required: true},
    fromUserId: {type: mongoose.Types.ObjectId, ref: 'User'}
    
},
{timestamps: true});

mongoose.model('Messages', messageSchema);