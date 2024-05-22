const { UserModel } = require("./UserModel");
const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");

const PostModel = sequelize.define("Post", {
  // id: {
  //     type: DataTypes.UUID,
  //     defaultValue: Sequelize.UUIDV4, // Generate UUID using UUIDv4
  //     primaryKey: true
  //   },
  // userId: {
  //     type: DataTypes.INTEGER,
  //     references: {
  //         model: UserModel,
  //         key: id
  //     }
  // },
  post_img_url: {
    type: DataTypes.STRING,
  },
  post_title: {
    type: DataTypes.STRING,
  },
  post_body: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
  },
});

const LikeModel = sequelize.define("Like", {
//   userId: {
//     type: DataTypes.INTEGER,
//     references: {
//       model: UserModel,
//       key: "id",
//     },
//   },
});

UserModel.hasMany(PostModel);
PostModel.belongsTo(UserModel);

UserModel.hasMany(LikeModel);
LikeModel.belongsTo(UserModel);

PostModel.hasMany(LikeModel);
LikeModel.belongsTo(PostModel);

module.exports = { PostModel, LikeModel };
