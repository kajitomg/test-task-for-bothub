'use strict';

const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const admin = users.find((user) => user?.username === process.env.ADMIN_USERNAME)
    return await queryInterface.bulkInsert('wallets', [
      {
        currency: 'credit',
        balance: 0,
        user_id: admin?.id,
        initial: true,
        created_at: currentTime,
        updated_at: currentTime,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const admin = users.find((user) => user?.username === process.env.ADMIN_USERNAME)
    await queryInterface.bulkDelete('transactions', {
      user_id: admin?.id
    })
    return queryInterface.bulkDelete('wallets', {
      user_id: admin?.id
    })
  }
};
