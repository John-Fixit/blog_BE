const { UserModel } = require("../Models/UserModel");
const bcrypt = require("bcryptjs");
require('dotenv').config();

const Joi = require("joi");

const SECRET = process.env.JWT_SECRET_KEY

const jwt = require("jsonwebtoken");

//Joi schemas================

    const registerSchema = Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })


    const loginSchema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })





//==========================





// Middleware to authenticate access token======================
const authenticateToken =(req, res, next)=> {
    const authHeader = req.headers['authorization'];



    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'User unauthorized' });
    }

    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
           
            return res.status(403).json({ message: 'token expired' });
        }

        req.user = {email: decoded.email, userId: decoded.userId}; // Attach user email and id to request object
        next(); // Proceed...
    });
}
//===========




const validateUser= async(req, res, next)=>{
    const {firstName, lastName, email, dob, password } = req?.body;

    const { error } = await registerSchema.validate({ firstName, lastName, email, dob, password });

    if(error){
        res.status(400).json({success: false, message: error?.details[0].message})
    }

    else{
            let findExistUser = await UserModel.findOne({ where : { email }, raw: true});
           
            if(findExistUser){
                return res.status(400).json({success: false, message: 'User already exist'})
            }
           else{
    
                next();
           }
            
    }

}


const login_middleware= async(req, res, next)=>{
    const {email, password} = req?.body;

    const { error } = await loginSchema.validate(req?.body);

    if(error){
        res.status(400).json({success: false, message: error?.details[0].message})
    }

    else{
        const userExist = await UserModel.findOne({where : { email }, raw: true})


        if(userExist){
            try{
                req.body.userId = userExist?.id;
                const checkPassword = await bcrypt.compare(password, userExist?.password)
                if(checkPassword){
                    next();
                }
                else{
                    res?.status(401)?.json({success: false, message: 'Invalid email or password'})
                }
            }
            catch(err){
                res?.status(500)?.json({success: false, message: 'Unexpected error'})
            }
        }
        else{
            res?.status(401)?.json({success: false, message: 'Invalid email or password'})
        }
    }
}





function isValidEmail(email) {
    // Example validation: Check if email follows a valid format
    return /\S+@\S+\.\S+/.test(email);
}


module.exports = {validateUser, login_middleware, authenticateToken}