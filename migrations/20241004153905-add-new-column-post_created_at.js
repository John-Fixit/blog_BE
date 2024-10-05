'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('posts');
    
    if (!tableDescription.post_created_at) {
      await queryInterface.addColumn('posts', 'post_created_at', {
        type: Sequelize.STRING,
      });
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'post_created_at');
  }
};
