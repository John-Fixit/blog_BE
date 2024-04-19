const { URL } = require('url');
const Joi = require('joi');


const postSchema = Joi.object({
    userId: Joi.number().required(),
    post_img_url: Joi.string()
    .uri({ scheme: ['http', 'https'] }) // Validate as a valid URI with HTTP/HTTPS scheme
    .regex(/\.(jpg|jpeg|png|gif)$/i)    // Ensure URL ends with a valid image file extension
    .message('Invalid image URL')
    .required()
    .messages({
      'string.empty': 'Image URL is required',
      'string.pattern.base': 'Image URL must end with .jpg, .jpeg, .png, or .gif',
      'any.required': 'Image URL is required'
    }),
    post_title: Joi.string().required(),
    post_body: Joi.string().required(),
    category: Joi.string().required()
})

const validatePostData = async(req, res, next)=>{
    const { userId, post_img_url, post_title, post_body, category } = req?.body;

    const { error } = await postSchema.validate({ userId, post_img_url, post_title, post_body, category });
    if(error){
        res.status(400).json({success: false, message: error?.details[0].message})
    }
    else{
        next();
    }

    
}



const validatePostImgUrl=(urlString)=>{
    try {
        // Attempt to create a new URL object
        new URL(urlString);
        // If no errors are thrown, the URL is valid
        return true;
      } catch (error) {
        console.log(error)
        // If an error is thrown, the URL is invalid
        return false;
      }
}


module.exports = {
    validatePostData
}