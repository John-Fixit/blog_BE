const express = require('express');
const ROUTER = express.Router();



ROUTER.get("/", function(_, res){
    res.send("Hello world, server is respondin");
})


module.exports = ROUTER;