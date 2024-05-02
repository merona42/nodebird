const User = require('../models/user');
const {userCache , postCache, hashtagCache} = require('../cache/cache');

exports.follow = async(req,res,next)=>{
    try{
        // const user = await User.findOne({
        //     where: {id: req.user.id},
        // });
        const user = Object.values(userCache).find(user=>user.id===req.user.id);
        if(user){
            await user.addFollowing(parseInt(req.params.id,10));
            res.send('success');
        }
        else{
            res.status(404).send('no user');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
};
exports.unfollow = async(req,res,next)=>{
    try{
        // const user = await User.findOne({
        //     where: {id: req.user.id},
        // });
        const user = Object.values(userCache).find(user=>user.id===req.user.id);
        if(user){
            await user.removeFollowing(parseInt(req.params.id,10));
            res.send('success');
        }
        else{
            res.status(404).send('no user');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
};

exports.updateName = async(req,res,next)=>{
    try{
        updatedUser = await User.update(
            {nick: req.params.name ,},
            {where: {id:req.user.id}}
        );  
        userCache[req.user.id].nick = req.params.name;
            const userPosts = await userCache[req.user.id].getPosts();
            userPosts.forEach((userPost)=>{
                postCache[userPost.id].User.nick=req.params.name
            });
            
            res.send('update success');
       
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

exports.like=async(req,res,next)=>{
    try{
        // const user = await User.findOne({
        //     where: {id: req.user.id},
        // });
        const user = Object.values(userCache).find((user)=>user.id === req.user.id);
        if(user && !user.likedPostIds.find((id)=>id === parseInt(req.params.postId))){
            await user.addLikedPost(parseInt(req.params.postId,10));
            user.likedPostIds.push(parseInt(req.params.postId,10));
            res.send('success to addLikedPost');
        }
        else{
            res.status(404).send('no user or already liked');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

exports.unlike=async(req,res,next)=>{
    try{
        // const user = await User.findOne({
        //     where: {id: req.user.id},
        // });
        const user = Object.values(userCache).find((user)=>user.id===req.user.id);
        if(user && user.likedPostIds.find((id)=>id === parseInt(req.params.postId))){
            await user.removeLikedPost(parseInt(req.params.postId));
            const idx = user.likedPostIds.indexOf(parseInt(req.params.postId));
            user.likedPostIds.splice(idx,1);
            res.send('success to delete LikedPost');
        }
        else{
            res.status(404).send('no user or already deleted');
        }
    }
    catch(err){
        console.error(err);
        next(err);
    }
}