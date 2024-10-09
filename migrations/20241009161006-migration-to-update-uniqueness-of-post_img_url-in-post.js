'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.removeIndex('posts', `post_img_url`);
    for(let i = 2; i <=62; i++){
      try{
        await queryInterface.removeIndex('posts', `post_img_url_${i}`);
      }
      catch(err){
        console.log("err in removing index", err?.message)
      }
    }

    // Step 2: Add the new unique index
    await queryInterface.addIndex('posts', ['post_img_url'], {
      unique: true,
      name: 'unique_post_img_url'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeIndex('Posts', 'unique_post_img_url');
  }
};
