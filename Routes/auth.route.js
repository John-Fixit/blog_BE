const { signInFn, signupFn, refreshToken } = require("../Controllers/auth.controllers");
const { validateUser, login_middleware } = require("../Middlewares/auth.middleware");

const AUTH_ROUTER = require("express").Router();


AUTH_ROUTER.get("/", (_, res)=>{
    res.send("Authentication route works")
});

AUTH_ROUTER.post("/register", validateUser, signupFn);
AUTH_ROUTER.post("/login", login_middleware, signInFn);
AUTH_ROUTER.post("/refresh_token", refreshToken);


module.exports = AUTH_ROUTER;