const {User, Post, Hashtag} = require("../models");
const userCache={};
const postCache = {};
const hashtagCache = {};

async function cacheInitFnc() {
  try {
    const users = await User.findAll();
    await Promise.all(users.map(async user => {
        const userLikedPosts= await user.getLikedPosts({
            include: [{
                model: User,
                attributes: ['id', 'nick'],
            }],
            order:[['createdAt','DESC']],
        });
        user.likedPostIds = userLikedPosts.map(post=>post.id);
        userCache[user.id] = user;
    }));
  
    const posts = await Post.findAll({
      include: [{
        model: User,
        attributes: ['id', 'nick'],
      }]
    });
    posts.forEach(post => {
      postCache[post.id] = post;
    });
  
    // const hashtags = await Hashtag.findAll()
    // hashtags.map(async (hashtag) => {
    //     hashtagCache[hashtag.id] = hashtag;
    // });
    const hashtags = await Hashtag.findAll({
      include: [{
        model: Post,
        attributes: ['id'],
      }]
    });
    hashtags.map((hashtag) => {
      hashtag.postIds = hashtag.Posts.map((post)=>post.id);
      hashtagCache[hashtag.id] = hashtag;
    });
  } 
  catch (err) {
      console.error(err);
  }
}

cacheInitFnc();


exports.userCache = userCache;
exports.postCache = postCache;
exports.hashtagCache = hashtagCache;
