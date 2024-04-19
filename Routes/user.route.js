const { getAllUsers, userProfile, updateProfile } = require("../Controllers/user.controller");
const { authenticateToken } = require("../Middlewares/auth.middleware");
const { updateProfileMiddleWare } = require("../Middlewares/user.middleware");

const USER_ROUTER = require("express")?.Router();



USER_ROUTER.get("/all_user", authenticateToken, getAllUsers);
USER_ROUTER.get("/user_profile", authenticateToken, userProfile);
USER_ROUTER.get("/update_profile", [authenticateToken, updateProfileMiddleWare], updateProfile);



module.exports = USER_ROUTER;