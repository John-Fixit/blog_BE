const { PostModel, LikeModel } = require("../Models/Post.model");
const { UserModel } = require("../Models/UserModel");
const { Op } = require("sequelize");

const createPost = async (req, res) => {
  const { userId, post_title, post_body, category, post_img_url } = req?.body;

  try {
    const user = await UserModel.findByPk(userId);

    if (user) {
      const postData = { post_title, post_body, category, post_img_url };

      const newPost = await user.createPost(postData);

      // console.log(newPost)

      if (newPost) {
        res
          .status(200)
          .json({ message: "post created successfully", status: true });
      } else {
        res
          .status(500)
          .json({ message: "Internal server error", status: false });
      }
    } else {
      //user not find

      res?.status(403).json({ status: false, message: "User not found" });
    }
  } catch (err) {
    console.log(err?.message);

    res.status(500).json({ message: "Internal server error", status: false });
  }
};

const getAllPost = async (req, res) => {
  try {
    const data = await PostModel.findAll({ raw: true });

    res
      ?.status(200)
      ?.json({ status: true, message: "All posts fetched", data: data });
  } catch (err) {
    console.log(err?.message);

    res
      ?.status(500)
      ?.json({ status: false, message: "Internal Server Error.." });
  }
};

const getUserPost = async (req, res) => {
  const req_user = req?.user;

  try {
    const data = await UserModel.findByPk(req_user?.userId, {
      include: {
        model: PostModel,
        attributes: { exclude: ["userId", "UserId"] },
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "dob", "email"],
      },
    });

    res
      .status(200)
      .json({ status: true, message: "User posts fetched", data: data });
  } catch (err) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//update post

const likePost = async (req, res) => {
  const { post_id } = req?.body;
  const { userId } = req?.user;

  try {
    const checkIfLiked = await LikeModel.findOne({
      where: { [Op.and]: [{ PostId: post_id }, { UserId: userId }] },
    });
    if (checkIfLiked) {
      const removeLike = await LikeModel.destroy({
        where: {
          [Op.and]: [{ PostId: post_id }, { UserId: userId }],
        },
      });
      return res.status(200).send({message: 'like removed', status: true});
    }

    else{
          const post = await PostModel.findByPk(post_id);
          if (!post) {
            return res.status(404).json({ status: false, message: "Post not found" });
          }
      
          const user = await UserModel.findByPk(userId);
      
          if (!user) {
            return res.status(404).json({ status: false, message: "User not found" });
          }
      
          // const like = await LikeModel.create({userId: user?.id, postId: });
          const like = await LikeModel.create({
            UserId: user.id,
            PostId: post.id,
          });
      
          // Optionally set the associations if needed
          await like.setUser(user);
          await like.setPost(post);
      
          res.status(200).json({ status: true, message: "Post liked" });

    }


  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

const commentToPost = async (req, res) => {
  console.log(req?.body);
};

//get post likes
const getPostLikes = async (req, res) => {
  const { post_id } = req?.params;

  const likes = await LikeModel.findAll({
    where: {
      PostId: { [Op.eq]: post_id},
    },
    include: [{ model: UserModel, attributes: { exclude: ['password', 'dob', 'email', 'id']}}, 
    // { model: PostModel}
  ],
    
  });

  res.status(200).json({ status: true, message: "Post likes fetched", data: likes });
};

//get post comments
const getPostComments = async (req, res) => {
  console.log(req?.params);
};

module.exports = {
  createPost,
  getAllPost,
  getUserPost,
  likePost,
  commentToPost,
  getPostLikes,
  getPostComments,
};
