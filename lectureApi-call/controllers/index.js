const axios = require('axios');

const URL = process.env.API_URL;
axios.defaults.headers.origin = process.env.ORIGIN;

const request = async (req,api)=>{
    try{
        if(!req.session.jwt){  
            const tokenResult = await axios.post(`${URL}/token`,{
                clientSecret: process.env.CLIENT_SECRET,
            });
            req.session.jwt = tokenResult.data.token;
        }
        return await axios.get(`${URL}${api}`,{
            headers:{authorization: req.session.jwt},
        });
    }
    catch(err){
        if(err.response?.status === 419){
            delete req.session.jwt;
            return request(req,api);
        }
        throw err.response;
    }
}

exports.getMyPosts = async (req,res,next)=>{
    try{
        const result = await request(req,'/posts/my');
        res.json(result.data);
    }
    catch(err){
        console.error(err);
        next(err);
    }
}
exports.searchByHashtag= async (req,res,next)=>{
    try{
        const result = await request(req,`/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`);
        res.json(result.data);
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

exports.renderMain = (req,res,next)=>{
    res.render('main',{key: process.env.CLIENT_SECRET});
}

exports.getMyFollowings = async(req,res,next)=>{
    try{
        const result = await request(req,'/users/followings');
        res.json(result.data);
    }
    catch(err){
        console.error(err);
        next(err);
    }
}

exports.getMyFollowers = async(req,res,next)=>{
    try{
        const result = await request(req,'/users/followers');
        res.json(result.data);
    }
    catch(err){
        console.error(err);
        next(err);
    }
}