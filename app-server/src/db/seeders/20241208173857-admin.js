'use strict';

const bcrypt = require('bcrypt');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();
    const roles = await queryInterface.sequelize.query(
      'SELECT * FROM roles',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const adminRole = roles.find((role) => role?.name === 'admin')
    return  await queryInterface.bulkInsert('users',[
      {
        username: process.env.ADMIN_USERNAME,
        password:  await bcrypt.hash(process.env.ADMIN_PASSWORD, 5),
        role_id: adminRole?.id,
        created_at: currentTime,
        updated_at: currentTime,
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const admin = users.find((user) => user?.username === process.env.ADMIN_USERNAME)
    await queryInterface.bulkDelete('auth-tokens', {
      user_id: admin?.id
    })
    await queryInterface.bulkDelete('chats', {
      user_id: admin?.id
    })
    await queryInterface.bulkDelete('jobs', {
      user_id: admin?.id
    })
    await queryInterface.bulkDelete('messages', {
      user_id: admin?.id
    })
    return await queryInterface.bulkDelete('users', {
      username: process.env.ADMIN_USERNAME
    })
  }
};
