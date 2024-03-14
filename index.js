const express = require("express");
const app = express();

const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const db = require('./db');


app.use(bodyParser.json());

const UserRoute = require('./Routes/userRoute');
app.use('/user',UserRoute);
const PostRoute = require('./Routes/postRoute');
app.use('/post',PostRoute);



app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

app.get('/',(req,res)=>{
        res.send('welcome to homepage')
})

app.listen(2100,()=>{
    console.log('Server is running');
})