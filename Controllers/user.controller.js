const { UserModel } = require("../Models/UserModel")

const getAllUsers = async(req, res)=>{

    try{
        const data = await UserModel.findAll({raw: true, attributes: { exclude: ['password', 'dob']}})

        res?.status(200)?.json({status: true, message: "users fetched", data: data})
    }
    catch(err){

        res.status(500).send("Internal Server Error. Please try again later.");

    }
}

const userProfile = async(req, res)=>{
    try{
        const {userId} = req?.user;

        

        const data = await UserModel.findByPk(userId, {attributes: { exclude: ['password']}});

        

        res.status(200).json({status: true, message: "User profile", data: data})
    }
    catch(err){
        res.status(500).json({status: false, message: "Internal server error"})
    }
}

//update user profile
const updateProfile = async(req, res)=>{
    try{
        const { userId } = req?.user;
        const { firstName, lastName, email, dob} = req?.body;

        //updating of user data here.......
    }
    catch(err){
        console.log(err?.message);

        res.status(500).json({status: false, message: "Internal server error"})
    }
}



module.exports = { getAllUsers, userProfile, updateProfile }