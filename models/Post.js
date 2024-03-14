const mongoose=require('mongoose');

const bcrypt = require('bcrypt')

const postSchema = new mongoose.Schema({
    userId  : {
        type : String,
        required : true
    },
    desc  : {
        type : String,
        max : 500
    },
    img : {
        type : String
    },
    likes :{
        type : Array,
        default : []
    }
},{timestamps : true});


const Post  = mongoose.model('Post',postSchema);
module.exports = Post;