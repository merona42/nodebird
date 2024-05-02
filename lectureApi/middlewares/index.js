const jwt = require('jsonwebtoken');
const ratelimit = require('express-rate-limit');
const {User,Domain} = require('../models');
exports.isLoggedIn = (req,res,next)=>{
    if(req.isAuthenticated()){ // 패스 포트 통해서 로그인 했는지 알아내는 함수 
        next();
    }
    else{
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        next();
    }
    else{
        const message = encodeURIComponent('로그인한 상태입니다.');
        res.redirect(`/?error=${message}`);
    }
};

exports.verifyToken = (req,res,next)=>{
    try{
        res.locals.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // 사용자에게  res.headers.authorization에 토큰 넣어달라고 요청할거임
        return next();
    }
    catch(err){
        if(err.name==='TokenExpiredError'){
            return res.status(419).json({
                code:419,
                message: '토큰이 만료되었습니다.',
            }) // 코드는 그냥 맘대로 넣은거, 의미만 잘 이렇게 써놓으면 됨
        }
        return res.status(401).json({
            code:401,
            message:'유효하지 않은 토큰입니다.',
        })
    }
};

const limiter =  ratelimit({
    windowMs: 60 * 1000,
    max: (req,res) => (req?.user?.Domains[0]?.type === 'premium')? 11 : 10,
    handler(req,res){
        res.status(this.statusCode).json({
            code: this.statusCode,
            message: `1분에 ${(req?.user?.Domains[0]?.type === 'premium')? 11: 10}번만 호출할 수 있습니다.`,
        });
    },
    });

exports.apiLimiter = async (req,res,next)=>{
    const user = await User.findOne({
        where:{id: res.locals.decoded.id},
        include:[{
            model: Domain,
            attributes: ['type'],
        }]
    });
    req.user=user;
    limiter(req,res,next);
   
}; 

exports.deprecated = (req,res)=>{
    res.status(410).json({
        code: 410,
        message: '새로운 버전이 나왔으니 최신버전을 이용해주세요.',
    })
};