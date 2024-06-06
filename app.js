const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');

const authRoutes = require('./routes/auth');

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, 'images');
    },
    filename: (req, file, cb) =>{
        cb(null, new Date().toISOString().replaceAll(':', '-') + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

app.use(bodyParser.json());
app.use(multer({storage: fileStorage, fileFilter}).single('image'));
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})
app.use(authRoutes);

app.use((err, req, res, next) =>{
    const message = err.message || 'An error occurred';
    const code = err.statusCode || 500;
    const data = err.data;
    console.log('app js', data);
    res.status(code).json({message, data});
})

mongoose.connect('mongodb+srv://nemanjavulin5:WoWwFd249hQHHYkr@cluster0.mtu0rep.mongodb.net/movies?retryWrites=true&w=majority&appName=Cluster0').then(() =>{
    app.listen(8080);
}).catch(err => console.log(err));