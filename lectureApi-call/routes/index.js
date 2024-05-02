const express = require('express');
const {getMyPosts, searchByHashtag, renderMain , getMyFollowers, getMyFollowings} = require('../controllers');
const router = express.Router();

router.get('/myposts',getMyPosts);
router.get('/search/:hashtag',searchByHashtag); 
router.get('/',renderMain);
router.get('/myFollowers',getMyFollowers);
router.get('/myFollowings',getMyFollowings)
module.exports=router;