"use strict";

const { crawlData } = require("../services/crawlFromDailyPostService");
const { PostModel, LikeModel, CommentModel } = require("../Models/Post.model");
const { UserModel } = require("../Models/UserModel");
const { Op, where } = require("sequelize");

//================== CREATE POST ====================
const createPost = async (req, res) => {
  const { post_title, post_body, category, post_img_url } = req?.body;
  const { userId } = req?.user;

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
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

//=============== CRAWL POST =====================
const crawlPost = async (data) => {
  try {
    // const data = await crawlData();

    if (data?.length) {
      const postSaved = await PostModel.bulkCreate(data, {
        ignoreDuplicates: true,
      });
      if (!postSaved) {
        console.log("Saving post failed");
      }
    }
  } catch (error) {
    console.log(log);
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

// ================= GET SINGLE POST ==================
const getSinglePost = async (req, res) => {
  const post_id = req?.params?.post_id;

  try {
    const post = await PostModel.findByPk(post_id, {
      include: [
        {
          model: UserModel,
          attributes: ["firstName", "lastName"],
        },
        {
          model: LikeModel,
        },
        {
          model: CommentModel,
          include: {
            model: UserModel,
            attributes: ["firstName", "lastName"],
          },
          attributes: { exclude: ["UserId", "PostId"] },
        },
      ],
    });

    if (post) {
      const relatedPost = await PostModel.findAll({
        where: { category: post?.category },
        limit: 7,
        order: [["createdAt", "DESC"]],
        attributes: { exclude: ["post_body"] },
      });

      res
        .status(200)
        .json({
          status: true,
          message: "Post fetched",
          data: {
            post,
            related_post: relatedPost?.filter(
              (item) => item?.post_img_url !== post?.post_img_url
            ),
          },
        });
    } else {
      res.status(404).json({ status: false, message: "Post not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error", status: false });
  }
};

//================ GET ALL POST =====================
const getAllPost = async (req, res) => {
  const page = parseInt(req?.query?.page) || 1;

  const postPerPage = parseInt(req?.query?.limit) || 40;

  const offset = (page - 1) * postPerPage;

  try {
    const data = await PostModel.findAll({
      offset: offset,
      limit: postPerPage,
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ["post_body"] },
      include: [
        {
          model: UserModel,
          attributes: ["firstName", "lastName"],
        },
        {
          model: LikeModel,
        },
      ],
    });

    const totalPost = await PostModel.count();

    const totalPages = Math.ceil(totalPost / postPerPage);

    const hasNextPage = page < totalPages;

    const hasPrevPage = page > 1 && totalPages > 1;

    const prevPage = hasPrevPage && page > 1 ? page - 1 : null;

    res?.status(200)?.json({
      status: true,
      message: "All posts fetched",
      data: {
        posts: data,
        hasNextPage: hasNextPage,
        nextPage: hasNextPage ? page + 1 : null,
        hasPrevPage,
        prevPage,
        totalPages,
        totalPostCount: totalPost,
      },
    });
  } catch (err) {
    console.log(err);
    res
      ?.status(500)
      ?.json({ status: false, message: "Internal Server Error.." });
  }
};

//=================== GET USER POST ======================
const getUserPost = async (req, res) => {
  const req_user = req?.user;

  try {
    const data = await UserModel.findByPk(req_user?.userId, {
      include: {
        model: PostModel,
        attributes: { exclude: ["userId", "UserId", "post_body"] },
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

//=========================== LIKE POST ========================
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
      return res.status(200).send({ message: "like removed", status: true });
    } else {
      const post = await PostModel.findByPk(post_id);
      if (!post) {
        return res
          .status(404)
          .json({ status: false, message: "Post not found" });
      }

      const user = await UserModel.findByPk(userId);

      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
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

//============== GET POST LIKES ====================
const getPostLikes = async (req, res) => {
  const { post_id } = req?.params;

  try {
    const likes = await LikeModel.findAll({
      where: {
        PostId: { [Op.eq]: post_id },
      },
      include: [
        {
          model: UserModel,
          attributes: { exclude: ["password", "dob", "email", "id"] },
        },
        // { model: PostModel}
      ],
    });

    res
      .status(200)
      .json({ status: true, message: "Post likes fetched", data: likes });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

//================ COMMENT TO POST =====================
const commentToPost = async (req, res) => {
  const { comment_text, postId } = req?.body;
  const { userId } = req?.user;

  try {
    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res
        ?.status(404)
        .json({ status: false, message: "user not found" });
    }

    const post = await PostModel.findByPk(postId);
    if (!post) {
      return res
        ?.status(404)
        .json({ status: false, message: "post not found" });
    }

    const comment = await CommentModel.create({
      PostId: post?.id,
      UserId: user?.id,
      comment_text,
    });

    // await comment.setUser(user);
    // await comment.setPost(post);

    res?.status(200).json({ status: true, message: "Comment successfull" });
  } catch (error) {
    res?.status(500).json({ message: "Internal server error", status: false });
  }
};

//================= GET POST COMMENTS ==================
const getPostComments = async (req, res) => {
  const { post_id } = req?.params;

  try {
    const comments = await CommentModel.findAll({
      where: { postId: post_id },
      include: {
        model: UserModel,
        attributes: ["firstName", "lastName"],
      },
    });

    res
      .status(200)
      .json({ status: true, message: "Comments fetched", data: comments });
  } catch (error) {
    res?.status(500).json({ message: "Internal server error", status: false });
  }
};

// ==================== UPDATE POST ====================
const updatePost = async (req, res) => {
  const { post_title, post_body, category, post_img_url } = req?.body;
  const { post_id } = req?.params;
  const { userId } = req?.user;
  try {
    const post = await PostModel.findByPk(post_id);
    if (!post) {
      return res.status(404).json({ status: false, message: "post not found" });
    }

    if (post?.UserId !== userId) {
      return res.status(200).json({
        status: false,
        message: "You can not update this post, as it is not created by you!",
      });
    }

    await post.update({
      post_title,
      post_body,
      post_img_url,
      category,
    });

    await post.save();

    res.status(200).json({ status: true, message: "post updated" });
  } catch (error) {
    res?.status(500).json({ message: "Internal server error", status: false });
  }
};

// ============== DELETE POST =================
const deletePost = async (req, res) => {
  const { postId } = req?.body;
  const { userId } = req?.user;

  try {
    const deletePost = await PostModel.destroy({
      where: {
        [Op.and]: {
          id: postId,
          userId: userId,
        },
      },
    });

    if (deletePost) {
      res
        .status(200)
        .json({ status: true, message: "Post deleted successfully" });
    } else {
      res
        .status(403)
        .json({ status: false, message: "Can not delete this post" });
    }
  } catch (error) {
    res?.status(500).json({ message: "Internal server error", status: false });
  }
};

module.exports = {
  crawlPost,
  createPost,
  getAllPost,
  getSinglePost,
  getUserPost,
  likePost,
  commentToPost,
  getPostLikes,
  getPostComments,
  updatePost,
  deletePost,
};
