const { createPost, getAllPost, getUserPost, likePost, commentToPost, getPostLikes, getPostComments, deletePost, updatePost, crawlPost, getSinglePost } = require("../Controllers/post.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");
const { validatePostData, validateLike, validateComment } = require("../Middlewares/post.middleware");

const POST_ROUTER = require("express")?.Router();

//routes=================


//==========POST METHODS===================//
POST_ROUTER.post("/create_post", [authenticateToken, validatePostData], createPost);

POST_ROUTER.post("/crawl", crawlPost);

POST_ROUTER.post("/like", [authenticateToken, validateLike], likePost);
POST_ROUTER.post("/comment", [authenticateToken, validateComment], commentToPost)


//=================GET METHODS===============//
POST_ROUTER.get("/all_post", getAllPost)
POST_ROUTER.get("/single_post/:post_id", getSinglePost)
POST_ROUTER.get("/user_post", authenticateToken, getUserPost);
POST_ROUTER.get("/like/:post_id", authenticateToken, getPostLikes)
POST_ROUTER.get("/comment/:post_id", authenticateToken, getPostComments)

//=========== UPDATE POST ===========================//
POST_ROUTER.patch("/update_post/:post_id", [authenticateToken], updatePost)

//================ DELETE METHOFS =======================//
POST_ROUTER.delete("/delete_post", authenticateToken, deletePost)


module.exports = POST_ROUTER;