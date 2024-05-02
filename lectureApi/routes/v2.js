const express = require('express');
const {verifyToken, apiLimiter} = require('../middlewares');
const {createToken, getMyPosts, getPostsByHashtag, corsWhenDomainMatches
    , getMyFollowers, getMyFollowings } = require('../controllers/v2');
const router = express.Router();


router.use(corsWhenDomainMatches);

router.post('/token',createToken);

router.get('/posts/my',verifyToken,apiLimiter,getMyPosts);
router.get('/posts/hashtag/:title',verifyToken,apiLimiter,getPostsByHashtag);
router.get('/users/followers',verifyToken,apiLimiter,getMyFollowers);
router.get('/users/followings',verifyToken,apiLimiter,getMyFollowings);
module.exports = router;