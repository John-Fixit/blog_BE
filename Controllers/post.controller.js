const PostModel = require("../Models/Post.model");
const { UserModel } = require("../Models/UserModel");

const createPost= async(req, res)=>{
    const { userId, post_title, post_body, category, post_img_url } = req?.body;

    try{
        const user = await UserModel.findByPk(userId);

        if(user){

            const postData = {post_title, post_body, category, post_img_url}


            const newPost = await user.createPost(postData)

            console.log(newPost)

            if(newPost){
                
                res.status(200).json({message: "post created successfully", status: true})
            }
            else{
                res.status(500).json({message: "Internal server error", status: false})
            }


            
        }
        else{
            //user not find

            res?.status(403).json({status: false, message: "User not found"})
        }

    }
    catch(err){
        console.log(err?.message);

        res.status(500).json({message: "Internal server error", status: false})
    }



}

const getAllPost = async(req, res)=>{

    try{
        const data = await PostModel.findAll({raw: true})

        res?.status(200)?.json({status: true, message: "All posts fetched", data: data})

    }
    catch(err){
        console.log(err?.message)

        res?.status(500)?.json({status: false, message: "Internal Server Error.."});
    }

}


const getUserPost= async(req, res)=>{
    const req_user = req?.user

    try{
        const data = await UserModel.findByPk(req_user?.userId, {
            include: {
                model: PostModel,
                attributes: {exclude: ['userId', "UserId"]}
            },
            attributes: {exclude: ['password', 'createdAt', "updatedAt", "dob", "email" ]}
             
        })

        res.status(200).json({status: true, message: "User posts fetched", data: data})
    }
    catch(err){
        console.log(err?.message)
        res.status(500).json({status: false, message: "Internal server error"})
    }
    
}


//update post


module.exports = {
    createPost,
    getAllPost,
    getUserPost
}