const {User, Post, Hashtag} = require('../models');
const { userCache, postCache, hashtagCache} = require('../cache/cache');
exports.afterUploadImage = (req,res)=>{
    console.log(req.file);
    res.json({url: `/img/${encodeURIComponent(req.file.filename)}`});
};

exports.uploadPost = async(req,res,next)=>{
    try{
        const newPost = await Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: req.user.id,
        });
        const post = await Post.findOne({
            where: {id: newPost.id},
            include: [{
                model: User,
                attributes: ['id','nick'],
            }],
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if(hashtags){
            const result = await Promise.all(
                hashtags.map(tag =>{
                    return Hashtag.findOrCreate({
                        where: {title: tag.slice(1).toLowerCase()},
                    })
                }),
            );
            const newtags=[];
            await post.addHashtags(result.map(r=>{
                if(r[1])newtags.push(r[0]);
                return r[0];
            }));
            await Promise.all(
                newtags.map(async newtag=>{
                    const newtagPosts = await newtag.getPosts();
                    newtag.postIds = newtagPosts.map((post)=>post.id);
                    hashtagCache[newtag.id]=newtag;
                })
            );
        }
        postCache[post.id]=post;
        res.redirect('/');
    }   
    catch(err){
        console.error(err);
        next(err);
    }
};

exports.postDelete = async(req,res,next)=>{
    try{
        const post = postCache[req.params.postId];
        if(post && post.User.id == req.user.id){
            const likingUsers = await post.getLikingUsers();
            likingUsers.forEach((user)=>{
                const idx = userCache[user.id].likedPostIds.indexOf(post.id);
                userCache[user.id].likedPostIds.splice(idx,1);
            })
            const postHashtags = await post.getHashtags();
            postHashtags.forEach((hashtag)=>{
                const idx= hashtagCache[hashtag.id].postIds.indexOf(post.id);
                hashtagCache[hashtag.id].postIds.splice(idx,1);
            })
            await Post.destroy({
                where: {id: post.id},
            })
            delete postCache[post.id];
            res.send('success');
        }
        else{
            res.status(404).send('no post OR not equal User and PostUser');
        }
    }
    catch(error){
        console.error(error);
        next(error);
    }
};