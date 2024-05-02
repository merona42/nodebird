const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const {User, Post} = require('../models');

module.exports = () =>{
    passport.serializeUser((user,done)=>{ // session에 유저정보 저장
        done(null,user.id); // (코드오류 (<=null아니면 시스템오류인거임),성공시 session에 저장할 정보)
        //done 함수가 serializeUser 하는함수의 본체임.
    });

    passport.deserializeUser((id,done)=>{
        User.findOne({
            where:{id},
            include: [{
                model: User,
                attributes: ['id','nick'],
                as: 'Followers',
            },
            {
                model: User,
                attributes: ['id','nick'],
                as: 'Followings',
            },
            {
                model: Post,
                attributes:['id'],
                as: 'LikedPosts'
            }
            ],
        })
            .then(user=>done(null,user))
            .catch(err=>done(err));
    });

    local();
    kakao();

};