const express = require('express');

const { isLoggedIn } = require('../middlewares');
const { follow, unfollow, updateName, like, unlike } = require('../controllers/user');

const router = express.Router();

router.post('/:id/follow', isLoggedIn,follow);
router.delete('/:id/unfollow', isLoggedIn,unfollow);
router.patch('/:name/update', isLoggedIn,updateName);

router.post('/:postId/like',isLoggedIn,like);
router.delete('/:postId/unlike',isLoggedIn,unlike);
module.exports=router;