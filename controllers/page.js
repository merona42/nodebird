//const {User, Post, Hashtag} = require('../models');
const {userCache , postCache, hashtagCache} = require('../cache/cache');
exports.renderProfile = async (req,res, next)=>{
    try{
        //const user = await User.findOne({where: {id: req.user.id}});
        const user = Object.values(userCache).find((user)=>user.id === req.user.id);
        if(user){
            // const likedPosts = await user.getLikedPosts({
            //     include: [{
            //         model: User,
            //         attributes: ['id', 'nick'],
            //     }],
            //     order:[['createdAt','DESC']],
            // });
            const likedPostIds = userCache[user.id].likedPostIds;
            const likedPosts = likedPostIds.map((id)=>postCache[id]).sort((a,b)=>b.createdAt - a.createdAt);

            res.render('profile',{
                title: '내 정보 - NodeBird',
                twits: likedPosts || [],
            });
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

exports.renderJoin = (req,res)=>{
    res.render('join', {title:'회원가입 - NodeBird'});
};


exports.renderMain= async (req,res, next)=>{
    try{
        // const posts = await Post.findAll({
        //     include:{
        //         model: User,
        //         attributes: ['id', 'nick'],
        //     },
        //     order:[['createdAt','DESC']],
        // });
        const posts = Object.values(postCache).map((post)=>post).sort((a,b)=>b.createdAt-a.createdAt);
        res.render('main',{
            title: 'NodeBird',
            twits: posts,
        });
    }
    catch(err){
        console.error(err);
        next(err);
    }
};

exports.renderHashtag = async(req,res,next)=>{
    const query = req.query.hashtag;
    if(!query){
        return res.redirect('/');
    }
    try{
        // const hashtag = await Hashtag.findOne({where: {title: query},});
        const hashtag = Object.values(hashtagCache).find((hashtag)=>hashtag.title === query);
        let posts=[];
        if(hashtag){
            // posts=await hashtag.getPosts({include: [{
            //     model: User,
            // }]});
            posts = hashtag.postIds.map((id)=>postCache[id]).sort((a,b)=>b.createdAt-a.createdAt);
        }




        return res.render('main',{
            title: `${query} | NodeBird`,
            twits: posts,
        });
    }
    catch(err){
        console.error(err);
        return next(err);
    }
}