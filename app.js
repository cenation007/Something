const app = require('express')();
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const express = require('express');
const mongoose= require('mongoose');
var dotenv = require('dotenv');
const path = require('path');
const multer = require('multer')
const https = require('http');
const socketio = require('socket.io');


var PORT = process.env.PORT || 4000
const HOST = process.env.HOST || `localhost`;

dotenv.config()


require('./models/user')
require('./models/post');
require('./models/message')

mongoose.connect(process.env.URI, {
    useNewUrlParser:true,
    useUnifiedTopology: true
})
mongoose.connection.on('connected', ()=> {
    console.log("Database connected")
})
mongoose.connection.on('error',() => {
    console.log('Error in database connection');
})
const socketEvents = require('./routes/Chat/Socket');


const http = https.Server(app);
const socket = socketio(http);
new socketEvents(socket).socketConfig();


///multer code
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".png");
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/jpeg' || file.mimetype == 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({ storage: storage, fileFilter: fileFilter });
//Upload route

///
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

app.use(bodyParser.json());
app.use(require('express').json());
app.use(require('./routes/auth'));
app.use(require('./routes/email-activate'));
app.use(require('./routes/post'));
app.use(require('./routes/likes'));
app.use(require('./routes/comment'));
app.use(require('./routes/getUsers'));
app.use(require('./routes/manageRequest'));
app.use(require('./routes/updateProfile'));
app.use(require('./routes/manageForgotPassword/forgotPassword'));
app.use(require('./routes/manageForgotPassword/resetPassword'));
app.use(require('./routes/Chat/socket-router'))

app.post('/imagefilter', upload.single('image'), (req, res, next) => {
    var name = req.file.path
    try {
        var spawn = require("child_process").spawn;
    var process = spawn('python',["./hello.py", 
                            req.file.path, 
                            "ayush"] ); 
    process.stdout.on('data', data=> {
        res.json({url: name.split('\\')[1] +','+ data.toString()}); 
    } )
    process.stderr.on('data', (data) => {
        res.json(`child stderr:\n${data}`);
      });
    } catch (error) {
        res.json(error);
    }
    
});
if(process.env.NODE_ENV == 'production'){
    app.use(express.static(path.resolve(__dirname, 'client/build')));
    app.get('*', function(request, response) {
        response.sendFile(path.resolve(__dirname, 'client/build', 'index.html'));
      });
}

http.listen(PORT,HOST,()=> {
    console.log("Server is running");
})
