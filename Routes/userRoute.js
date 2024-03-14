const express =require('express');
const router = express.Router();
const User = require('./../models/User');
const { json } = require('body-parser');

const {jwtAuthMiddleware,generateToken} = require('./../jwt')
router.get('/',(req,res)=>{
    res.send('hey');
})

//signup

router.post('/signup',async(req,res)=>{
    try{
        const newUser = new User(req.body);

        // const newUser = new User(data);

        const user = await newUser.save();
        console.log('data saved');

        const payLoad= {
            id:user.id,
            username : user.username,
            email : user.email,
             role : user.role,
        }
        // console.log(JSON.stringify(payLoad));

        const token = generateToken(payLoad);
        console.log("Token is : ",token);
        
        res.status(200).json({response: user,token});
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//login
router.post('/login',async(req,res)=>{
    try{
         const {username,password} = req.body;

         const user = await User.findOne({username:username});
         if(!user||!(await user.comparePassword(password))){
            return res.status(404).json({error : 'Invalid email or password'});
         }

         const payLoad= {
            id:user.id,
            username : user.username,
            email : user.email,
             role : user.role,
        }

         const token = generateToken(payLoad);
        console.log("Token is : ",token);

         res.status(200).json(user)
    }
    catch(err){
     console.log(err);
     res.status(500).json({error:'Internal Server Error'});
    }

})

//update part
router.put('/:id',jwtAuthMiddleware,async(req,res)=>{
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // console.log(user);
        
    if (req.body.userId === req.params.id || req.body.isAdmin){       
         if(req.body.newPassword){
            try{
                user.password = req.body.newPassword;
                await user.save();
            }
            catch(err){
                console.log(err);
                res.status(500).json({error:'Internal Server Error'});  
            }
        }
            try{
           
                const updatedID = req.body;
        
                const response = await User.findByIdAndUpdate(req.params.id,updatedID,{
                        new : true,
                        runValidators: true,
                });
        
                console.log('Candidate data updated');
                res.status(200).json(response);      
               }
               catch(err){
                    console.log(err);
                    res.status(500).json({error:'Internal Server Error'});  
              }
        }
        else{
            res.status(403).json('Update your account only!');  
        }
    
}
catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Error'});  
}
    
})

//deleting 

router.delete('/:id',jwtAuthMiddleware,async(req,res)=>{
    try {  
    if (req.body.userId === req.params.id || req.body.isAdmin){       
            try{
           
                const response = await User.findByIdAndDelete(req.params.id);
        
                // console.log('Candidate data deleted');
                res.status(200).json('User data deleted');      
               }
               catch(err){
                    console.log(err);
                    res.status(500).json({error:'Internal Server Error'});  
              }
        }
        else{
            res.status(403).json('You can delete only your account !');  
        }
    
}
catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Error'});  
}
    
})

//get user 
router.get('/:id',jwtAuthMiddleware,async(req,res)=>{
    try{
        const user= await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }
    catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Error'});
    }
})
//follw a user part
router.put('/:id/follow',jwtAuthMiddleware,async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push :{followers: req.body.userId}})
                await currentUser.updateOne({$push :{following: req.params.id}})
                
                res.status(200).json('User now followed')
            }
            else{
                res.status(403).json('follow already!')
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
        }
    }
    else{
        res.status(403).json('You not follow yourself!');  
    }
})

//unfollow a user
router.put('/:id/unfollow',jwtAuthMiddleware,async (req,res)=>{
    if(req.body.userId !== req.params.id){
        try{
            const user = await User.findById(req.params.id)
            const currentUser = await User.findById(req.body.userId)
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull :{followers: req.body.userId}})
                await currentUser.updateOne({$pull :{following: req.params.id}})
                
                res.status(200).json('User now unfollowed')
            }
            else{
                res.status(403).json('you dont follow this user!')
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
        }
    }
    else{
        res.status(403).json('You not follow yourself!');  
    }
})
//get list of following users
router.get('/following/:id',jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const following = await User.find({ _id: { $in: user.following }}).select('_id username');;
        res.status(200).json(following);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
//get followers
router.get('/followers/:id',jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const followers = await User.find({ _id: { $in: user.followers } }).select('_id username');;
        
        res.status(200).json(followers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router