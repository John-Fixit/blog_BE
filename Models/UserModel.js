const sequelize = require("./sequelize");
const { DataTypes } = require("sequelize");

const UserModel = sequelize.define(
  "User",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dob: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    indexes: [{ unique: true, fields: ["email"] }],
  }
);

//synchronize the model with the database
async function syncDatabase() {
  await sequelize.sync({ alter: true });
  console.log("Database synchronized.");
}

module.exports = {
  syncDatabase,
  UserModel,
};
