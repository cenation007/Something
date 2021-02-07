const router = require('express').Router();
const mongoose = require('mongoose');
const path = require('path');
const Post = mongoose.model('Post');
const {postValidation} = require('../validation');
const verifyUser = require('../middleware/verifyUser');
router.post('/createpost',verifyUser,(req,res) => {
    console.log(req.body)
    if(req.body.photo == null) return res.status(400).json({msg:"No file uploaded"});
    //const file = req.files.file;
    //var extension = path.extname(file.name);
    /*var name = `${file.name}` +'-'+`${(new Date()).getTime()}`+`${extension}`;
    const myPath =  path.join(__dirname, `../../client/public/images/${name}`);
    file.mv(`${myPath}`,err => {
        if(err) {
            return res.status(500).send(err);
        }
    });
    */
    const {title,body,photo} = req.body;
    const {error} = postValidation({title,body});
    req.user.password = undefined;
    if(error) {
        return res.status(403).json({msg: error.details[0].message});
    } else {
        const newPost = new Post({
            title,
            body,
            photo,
            postedBy: req.user,
        });
        newPost.save()
        .then(result => {
            return res.json({post:result});
        })
        .catch(error => {
            console.log(error);
        })
    }
}
)

router.get('/allpost',(req,res) => {
    Post.find({hidden: false})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(posts => {
        res.json({posts});
    })
    .catch(error => {
        console.log(error);
    })
}
)

router.get('/myposts',verifyUser,(req,res) => {
    Post.find({postedBy: req.user._id, hidden:false})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(post => {
        res.json({post})
    })
    .catch(err => {
        console.log(err)
    })
})


router.get('/getuserposts/:userid',verifyUser,(req,res) => {
    Post.find({postedBy: req.params.userid, hidden:false})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(post => {
        res.json({post})
    })
    .catch(err => {
        console.log(err)
    })
})

router.get(`/userpost/:userId`,verifyUser,(req,res) => {
    Post.find({postedBy: req.params.userId, hidden: false})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(post => {
        res.json({post})
    })
    .catch(err => {
        console.log(err)
    })
})

router.delete(`/deletepost/:postId`, verifyUser, (req,res) => {
    Post.findOne({_id: req.params.postId})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(post => {
        if(post.postedBy._id.toString() === req.user._id.toString()) {
            
            post.remove()
            .then(res => res.json(res)).catch(err => res.json(err))
        }
    }).catch(err => res.json(err))
})

router.put(`/hidepost/:postId`, verifyUser, (req,res) => {
    Post.findOneAndUpdate({_id: req.params.postId}, {hidden: true}, {new: true})
    .populate('comments.postedBy',"_id name")
    .populate('postedBy',"_id name")
    .then(res => res.status(403).json({msg: "Forbidden"})
        ).catch(err => res.json(err))
})
module.exports = router;