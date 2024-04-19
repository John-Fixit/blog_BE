
const Joi = require("joi");

//Joi schemas================

const updateProfileSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
})





//==========================

const updateProfileMiddleWare= async(req, res, next)=>{
    const { firstName, lastName, email, dob} = req?.body;

    const { error } = await updateProfileSchema.validate({ firstName, lastName, email});

    if(error){
        res.status(400).json({status: false, message: error?.details[0].message})
    }
    else{
        next();
    }
}


module.exports = {
    updateProfileMiddleWare
}