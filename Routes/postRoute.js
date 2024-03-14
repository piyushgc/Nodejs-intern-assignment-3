const express =require('express');
const router = express.Router();
const Post = require('./../models/Post');
const User = require('../models/User');

// create new post
router.post('/',async (req,res)=>{
    const newPost = new Post(req.body)
    try{
         const savedPost = await newPost.save();
         res.status(200).json(savedPost);
    }
    catch{
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
//update a post
router.put('/:id',async (req,res)=>{
    try{
        const post  = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
             await post.updateOne({$set:req.body});
             res.status(200).json('post updated')
        }
        else{
            res.status(403).json('Update your post only');
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
//delete

router.delete('/:id',async (req,res)=>{
    try{
        const post  = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
             await post.deleteOne();
             res.status(200).json('post deleted')
        }
        else{
            res.status(403).json('Delete your post only');
        }
    }
    catch{
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})
//like_dislike a post
router.put('/:id/like',async (req,res)=>{
    
        try{
            const post  = await Post.findById(req.params.id);
            const authorId = post.userId;
            const user  = await User.findById(authorId);
            
            if (!user.followers.includes(req.body.userId)) {
            return res.status(403).json({ error: 'User is not following the author' });
            }

         
            if(!post.likes.includes(req.body.userId)){
                await post.updateOne({$push :{likes: req.body.userId}})
                res.status(200).json('User like the post')
            }
            else{
                await post.updateOne({$pull :{likes: req.body.userId}})
                res.status(200).json('User dislike the post')
            }
        }
        catch(err){
            console.log(err);
            res.status(500).json({error:'Internal Server Error'});
        }
       
    })

//get a post

router.get('/:id',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id)
        res.status(200).json(post);
    }catch(err){
        console.log(err);
        res.status(500).json({error:'Internal Server Error'});
    }
})

//get latest posts
router.get('/latest-posts/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const latestPosts = await Post.find({userId})
            .sort({ createdAt: -1 }) 
            .limit(5); 
        res.status(200).json(latestPosts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports= router