'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.TEXT
    })
   
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.changeColumn('posts', 'post_body', {
      type: Sequelize.STRING, // Revert to STRING if needed
      allowNull: true, // Set this depending on your schema
    });
  }
};
