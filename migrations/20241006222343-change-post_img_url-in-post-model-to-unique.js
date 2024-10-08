'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn("posts", "post_img_url", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.changeColumn("posts", "post_img_url", {
      type: Sequelize.STRING,
      unique: false,
      allowNull: true
    })
  }
};
