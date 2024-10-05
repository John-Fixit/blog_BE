'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.TEXT('long')
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.TEXT
    })
  }
};
