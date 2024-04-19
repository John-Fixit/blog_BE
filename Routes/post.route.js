const { createPost, getAllPost, getUserPost } = require("../Controllers/post.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");
const { validatePostData } = require("../Middlewares/post.middleware");

const POST_ROUTER = require("express")?.Router();

//routes=================
POST_ROUTER.post("/create_post", [authenticateToken, validatePostData], createPost);
POST_ROUTER.get("/all_post", authenticateToken, getAllPost)
POST_ROUTER.get("/user_post", authenticateToken, getUserPost);



module.exports = POST_ROUTER;