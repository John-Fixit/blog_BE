const { UserModel } = require("./UserModel");
const sequelize = require("./sequelize");
const { DataTypes, Sequelize } = require("sequelize");

const PostModel = sequelize.define(
  "Post",
  {
    post_img_url: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    post_title: {
      type: DataTypes.STRING,
    },
    post_body: {
      type: DataTypes.TEXT("long"),
    },
    category: {
      type: DataTypes.STRING,
    },
    post_created_at: {
      type: DataTypes.STRING,
    },
  },
  // {
  //   sequelize,
  //   modelName: "Post",
  //   tableName: "posts",

  //   hooks: {
  //     beforeCreate: async (post) => {
  //       const [result] = await sequelize.query(
  //         `SELECT COMPRESS(?) AS compressed`,
  //         {
  //           replacements: [post?.post_body],
  //           type: Sequelize.QueryTypes.SELECT,
  //         }
  //       );

  //       post.post_body = result.compressed;
  //     },
  //     beforeBulkCreate: async (posts) => {
  //       for (const post in posts) {
  //         const [result] = await sequelize.query(
  //           `SELECT COMPRESS(?) AS compressed`,
  //           {
  //             replacements: [post?.post_body],
  //             type: Sequelize.QueryTypes.SELECT,
  //           }
  //         );
  //         post.post_body = result.compressed;
  //       }
  //     },
  //     beforeUpdate: async (post) => {
  //       const [result] = await sequelize.query(
  //         `SELECT COMPRESS(?) AS compressed`,
  //         {
  //           replacements: [post?.post_body],
  //           type: Sequelize.QueryTypes.SELECT,
  //         }
  //       );

  //       post.post_body = result.compressed;
  //     },
  //     afterFind: async (posts) => {
  //       if (Array.isArray(posts)) {
  //         for (const post of posts) {
  //           const result = await sequelize.query(
  //             `SELECT UNCOMPRESS(?) AS uncompressed`,
  //             {
  //               replacements: [post.post_body],
  //               type: Sequelize.QueryTypes.SELECT,
  //             }
  //           );
  //           post.post_body = result.uncompressed;
  //         }
  //       } else {
  //         const [result] = await sequelize.query(
  //           `SELECT UNCOMPRESS(?) AS uncompressed`,
  //           {
  //             replacements: [posts.post_body],
  //             type: Sequelize.QueryTypes.SELECT,
  //           }
  //         );
  //         posts.post_body = result.uncompressed;
  //       }
  //     },
  //   },
  // }
);

const LikeModel = sequelize.define("Like", {
  //   userId: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //       model: UserModel,
  //       key: "id",
  //     },
  //   },
});

const CommentModel = sequelize.define("Comment", {
  comment_text: {
    type: DataTypes.TEXT,
  },
});

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

UserModel.hasMany(LikeModel);
LikeModel.belongsTo(UserModel);

PostModel.hasMany(LikeModel);
LikeModel.belongsTo(PostModel);

UserModel.hasMany(CommentModel);
CommentModel.belongsTo(UserModel);

PostModel.hasMany(CommentModel);
CommentModel.belongsTo(PostModel);

module.exports = { PostModel, LikeModel, CommentModel };
