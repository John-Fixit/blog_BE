const express = require("express");
const bodyParser = require("body-parser");
const ROUTER = require("./Routes/index")
const AUTH_ROUTER = require("./Routes/auth.route")
const sequelize = require("./Models/sequelize");
const { syncDatabase } = require("./Models/UserModel");
const USER_ROUTER = require("./Routes/user.route");
const POST_ROUTER = require("./Routes/post.route");
const app = express();

syncDatabase();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.use("/", ROUTER);
app.use("/api/auth/", AUTH_ROUTER)
app.use("/api/user/", USER_ROUTER)
app.use("/api/post/", POST_ROUTER)


app.listen(3001, ()=>{
    console.log(`Server is running on PORT ${3001}`);
})