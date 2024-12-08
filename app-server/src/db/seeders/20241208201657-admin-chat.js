'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const currentTime = new Date();
    const users = await queryInterface.sequelize.query(
      'SELECT * FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const admin = users.find((user) => user?.username === process.env.ADMIN_USERNAME)
    const models = await queryInterface.sequelize.query(
      'SELECT * FROM ais',
      { type: Sequelize.QueryTypes.SELECT }
    );
    const model = models.find((model) => model?.name === 'gpt-3.5-turbo')
    return await queryInterface.bulkInsert('chats', [
      {
        name: 'chat',
        user_id: admin?.id,
        model_id: model?.id,
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
    return queryInterface.bulkDelete('chats', {
      name: 'chat',
      user_id: admin?.id
    })
  }
};
