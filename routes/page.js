const express = require('express');
const {User} = require('../models');
const {isLoggedIn, isNotLoggedIn} = require('../middlewares');
const {
    renderProfile, renderJoin, renderMain, renderHashtag,
} = require('../controllers/page');
const router = express.Router();

router.use((req,res,next)=>{
    res.locals.user = req.user;
    res.locals.followerCount = req.user?.Followers?.length || 0;
    res.locals.followingCount = req.user?.Followings?.length || 0;
    res.locals.followingIdList= req.user?.Followings?.map(f=>f.id) || [];
    res.locals.likedPostIdList = req.user?.LikedPosts?.map(p=>p.id)||[];
    next();
})

router.get('/profile',isLoggedIn, renderProfile);
router.get('/join',isNotLoggedIn, renderJoin);
router.get('/',renderMain);
router.get('/hashtag', renderHashtag);
module.exports=router;