'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();
    return await queryInterface.bulkInsert('roles', [
      {
        name: 'admin',
        permissions: ['ALL'],
        created_at: currentTime,
        updated_at: currentTime,
      },
      {
        name: 'user',
        permissions: null,
        created_at: currentTime,
        updated_at: currentTime,
      }
    ]);
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('roles', {
      [Sequelize.Op.or]:[
        {
          name: 'admin'
        },
        {
          name: 'user'
        },
      ]
    })
  }
};
