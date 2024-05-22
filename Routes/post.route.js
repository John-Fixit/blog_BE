const { createPost, getAllPost, getUserPost, likePost, commentToPost, getPostLikes, getPostComments } = require("../Controllers/post.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");
const { validatePostData, validateLike } = require("../Middlewares/post.middleware");

const POST_ROUTER = require("express")?.Router();

//routes=================


//==========POST METHODS===================//
POST_ROUTER.post("/create_post", [authenticateToken, validatePostData], createPost);
POST_ROUTER.post("/like", [authenticateToken, validateLike], likePost);
POST_ROUTER.post("/comment", commentToPost)


//=================GET METHODS===============//
POST_ROUTER.get("/all_post", authenticateToken, getAllPost)
POST_ROUTER.get("/user_post", authenticateToken, getUserPost);
POST_ROUTER.get("/like/:post_id", authenticateToken, getPostLikes)
POST_ROUTER.get("/comment/:post_id", authenticateToken, getPostComments)



module.exports = POST_ROUTER;