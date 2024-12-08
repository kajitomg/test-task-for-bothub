'use strict';

const { CreationOptional } = require('sequelize');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const admin = users.find((user) => user?.username === process.env.ADMIN_USERNAME)
    return await queryInterface.bulkInsert('ais', [
      {
        name: 'gpt-3.5-turbo',
        in_rate: 0.15,
        out_rate: 0.2,
        created_at: currentTime,
        updated_at: currentTime,
        created_by: admin?.id,
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('ais', {
      [Sequelize.Op.or]:[
        {
          name: 'gpt-3.5-turbo'
        },
      ]
    })
  }
};
