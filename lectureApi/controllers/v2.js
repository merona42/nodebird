const {Domain, User,Post,Hashtag} = require('../models');
const jwt = require('jsonwebtoken');
const cors = require('cors');

exports.createToken = async(req,res,next)=>{
    const {clientSecret} = req.body;
    try{
        const domain = await Domain.findOne({
            where: {clientSecret},
            include: [{
                model:User,
                attrributes: ['id','nick'],
            }]
        })

        if(!domain){
            return res.status(401).json({
                code:401,
                message:'등록되지 않은 토큰입니다. 토큰을 등록해주세요.',
            })
        }

        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        },process.env.JWT_SECRET,{
            expiresIn:'30m',
            issuer:'nodeBird',
        })

        return res.json({
            code:200,
            message: '토큰 발급 되었습니다.',
            token,
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            code:500,
            message:'서버 에러',
        });
    }
}

exports.tokenTest = async(req,res,next)=>{
    res.json(res.locals.decoded);
}

exports.getMyPosts= (req,res, next)=>{
    Post.findAll({where: {userId: res.locals.decoded.id}})
        .then((posts)=>{
            res.json({
                code:200,
                payload: posts,
            })
        })
        .catch((err)=>{
            return res.status(500).json({
                code:500,
                message:'서버 에러',
            });
        }) 
} 
exports.getPostsByHashtag = async(req,res,next)=>{
    try{
        const hashtag = await Hashtag.findOne({where: {title: req.params.title}});
        if(!hashtag){
            return res.status(404).json({
                code: 404,
                message: '유효하지 않은 헤시테그입니다.',
            })
        }
        const posts = await hashtag.getPosts();
        if(posts.length ===0){
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다.',
            })
        }
        return res.json({
            code:200,
            payload: posts,
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            code:500,
            message:'서버 에러',
        })
    }
}

exports.corsWhenDomainMatches = async(req,res,next)=>{
    const domain = await Domain.findOne({
        where: {host: req.get('origin')},
    });

    if(domain){
        cors({
            origin: req.get('origin'),
            credentials: true,
        })(req,res,next);
    }
    else{
        next();
    }
}

exports.getMyFollowers = async(req,res,next)=>{
    try{
        const user = await User.findOne({
            where: {id: res.locals.decoded.id},
            include: [{
                model: User,
                attributes: ['id','nick'],
                as: 'Followers',
            }]
        });
        if(!user){
            return res.status(404).json({
                code: 404,
                message: '없는 유저입니다.'
            })
        }
        if(user.Followers.length===0){
            return res.status(404).json({
                code:404,
                message: '팔로워가 없습니다.',
            })
        }
        return res.json({
            code:200,
            payload: user.Followers,
        })
    }
    catch(err){
        console.error(err);
        next(err);
    }
    

}
exports.getMyFollowings = async(req,res,next)=>{
    try{
        const user = await User.findOne({
            where: {id: res.locals.decoded.id},
            include: [{
                model: User,
                attributes: ['id','nick'],
                as: 'Followings',
            }]
        });
        if(!user){
            return res.status(404).json({
                code: 404,
                message: '없는 유저입니다.'
            })
        }
        if(user.Followings.length===0){
            return res.status(404).json({
                code:404,
                message: '팔로잉하는 사람이 없습니다.',
            })
        }
        return res.json({
            code:200,
            payload: user.Followings,
        })
    }
    catch(err){
        console.error(err);
        next(err);
    }

}