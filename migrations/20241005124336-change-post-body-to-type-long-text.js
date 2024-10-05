'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.TEXT("long"),
      allowNull: true,             // Adjust if you need it to be nullable
      charset: 'utf8mb4'
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.BLOB
    })
  }
};
