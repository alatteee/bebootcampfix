'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('materi', [
      {
        materi_id: '1f85e85c-2d9a-4d2b-9810-26dbd6cc92b3', // Specify your own UUID
        nama_materi: 'Node.js',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        materi_id: 'b779a29d-1687-49b6-93cc-694c28a0c75f', // Specify your own UUID
        nama_materi: 'React',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        materi_id: '1a37f7b7-4939-44a0-8b49-3d0a4df0469f', // Specify your own UUID
        nama_materi: 'Java',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('materi', null, {});
  },
};
