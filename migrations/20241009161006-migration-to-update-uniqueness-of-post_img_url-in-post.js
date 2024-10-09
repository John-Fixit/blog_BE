'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Add the new unique index for 'post_img_url' outside a transaction
      await queryInterface.addIndex('posts', ['post_img_url'], {
        unique: true,
        name: 'unique_post_img_url',
      });
      console.log("Unique index for post_img_url added successfully.");
    } catch (err) {
      console.log("Error in adding unique index:", err?.message);
      throw err;  // Ensure Sequelize knows this migration failed
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Remove the unique index during rollback
      await queryInterface.removeIndex('posts', 'unique_post_img_url');
      console.log("Unique index for post_img_url removed successfully.");
    } catch (err) {
      console.log("Error in removing unique index:", err?.message);
      throw err;  // Ensure Sequelize knows this rollback failed
    }
  },
};
