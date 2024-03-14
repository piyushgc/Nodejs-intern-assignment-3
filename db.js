const mongoose = require('mongoose');
require('dotenv').config();
// const mongoUrl = 'mongodb://localhost:27017/SocialMedia'
const mongoUrl = process.env.DB_URL;
const options={
    useNewUrlParser : true,
    useUnifiedTopology: true
}

mongoose.connect(mongoUrl,options);
const db= mongoose.connection;

db.on('connected',()=>{
    console.log('Connected to Mongodb');    
});

db.on('error',(err)=>{
    console.log('Connection error',err);    
});

db.on('disconnected',()=>{
    console.log('Disconnected to Mongodb');    
});

module.exports=db;