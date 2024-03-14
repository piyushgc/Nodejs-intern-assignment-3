const mongoose=require('mongoose');

const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type :String,
        required : true,
        min:4,
        max:10,
        unique:true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true,
    },
    profileImageURL : {
        type : String,
        default : '',
    },
    followers :{
        type : Array,
        default : []
    },
    following :{
        type : Array,
        default : []
    },
    isAdmin :{
        type : Boolean,
        default : false
    },
     desc :{
        type : String,
        max : 50,
     }
   
},{timestamps : true});

userSchema.pre('save',async function(next){
    const user = this

    if(!user.isModified('password')) return next();
    try{
        const salt = await bcrypt.genSalt(10);

        const hashedPassword  = await bcrypt.hash(user.password,salt)

        user.password = hashedPassword;
        next();
    }
    catch(err){
        return next(err);
    }
})
userSchema.methods.comparePassword = async function(newPassword){
        try{
            const isMatched = await bcrypt.compare(newPassword,this.password)
            return isMatched;
        }
    catch(err){
            throw err;
    }
}

const User  = mongoose.model('User',userSchema);
module.exports = User;