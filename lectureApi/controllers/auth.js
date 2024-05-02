const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/user');
//const {userCache} = require('../cache/cache');
exports.join = async(req,res,next)=>{
    const {email, nick, password} = req.body;
    try{
        const exUser = await User.findOne({where: {email : email}});
        //const exUser = Object.values(userCache).find((user)=>user.email===email);
        if(exUser){
            return res.redirect('/join?error=exist');
        }
        const hash = await bcrypt.hash(password,12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        //userCache[newUser.id]=newUser;
        
        return res.redirect('/');
    }
    catch(error){
        console.error(error);
        return next(error);
    }
};

exports.login = (req,res,next)=>{
    passport.authenticate('local',(authError,user,info)=>{
        if(authError){
            console.error(authError);
            return next(authError);
        }
        if(!user){
            return res.redirect(`/?error=${info.message}`);
        }
        return req.login(user, (loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    })(req,res,next); //passport.authenticate자체가 미들웨어여서 이렇게 인자 붙여줘야 미들웨어가 원활히 실행됨.
};

exports.logout = (req,res)=>{
    req.logout(()=>{
        res.redirect('/');
    });
};