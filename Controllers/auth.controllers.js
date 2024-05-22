const { UserModel } = require("../Models/UserModel")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require('dotenv').config();

const SECRET = process.env.JWT_SECRET_KEY


const saltRound = 10;







const signupFn= async(req, res)=>{
    const { firstName, lastName, email, dob, password} = req?.body

    try{
        let hashedPsw = await bcrypt.hash(password, saltRound);

        await UserModel.create({
            firstName, lastName, email, dob, password: hashedPsw
        })
        res.status(200).json({ success: true, message: 'User created successfully' });
    }
    catch(error){
        console.log(error)
        res.status(500).json({ success: false, message: 'Failed to create user', error: error.message });
    }

}


const signInFn=(req, res)=>{
    const { email, password, userId } = req?.body;

    const accessToken = jwt.sign({email, userId}, SECRET, {expiresIn: "2h"})
    const refreshToken = jwt.sign({email, userId}, SECRET, {expiresIn: "10h"})

    res?.status(200).json({success: true, message: 'User logged in', accessToken, refreshToken})
}



const refreshToken= async(req, res)=>{
    const { refreshToken } = req?.body;

    jwt.verify(refreshToken, SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Token expired' });
        }
        const accessToken = jwt.sign({email: decoded.email}, SECRET, {expiresIn: "2h"})
        res.status(200).json({success: true, message: 'Token refreshed', accessToken})
    });

}



module.exports = {
    signInFn,
    signupFn,
    refreshToken
}