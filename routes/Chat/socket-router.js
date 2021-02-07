const router = require('express').Router();
const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const User = mongoose.model('User');
const Post  = mongoose.model('Post');
const Messages = mongoose.model('Messages');
const verifyUser = require('../../middleware/verifyUser');
var dotenv = require('dotenv');
dotenv.config();

const  getMessages =async ({userId, toUserId})=>{
    const data = {
            '$or' : [
                { '$and': [
                    {
                        'toUserId': userId
                    },{
                        'fromUserId': toUserId
                    }
                ]
            },{
                '$and': [ 
                    {
                        'toUserId': toUserId
                    }, {
                        'fromUserId': userId
                    }
                ]
            },
        ]
    };      
    return new Promise( async (resolve, reject) => {
        try {
            Messages.find(data).sort({'timestamp':1}).then( data => {
                resolve(data);
            }).catch(err => reject(err))
        } catch (error) {
            reject(error)
        }
    });
}

router.post('/getMessages',async (request, response)=>{
    let userId = request.body.userId;
    let toUserId = request.body.toUserId;           
    if (userId == '') {
        response.status("SERVER_ERROR_HTTP_CODE").json({
            error : true,
            message : "USERID_NOT_FOUND"
        });
    }else{
        try {
            const messagesResponse =await getMessages({
                userId:userId,
                toUserId: toUserId
            });
            response.status(200).json({
                error : false,
                messages : messagesResponse
            });
        } catch ( error ){
            response.status(403).json({
                error : true,
                messages : "USER_NOT_LOGGED_IN"
            });
        }
    }
});


module.exports = router;