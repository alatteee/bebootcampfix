'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Tambahkan data dummy ke tabel dummy
    await queryInterface.bulkInsert('dummy', [
      {
        dummy_id: '6c84fb90-12c4-11e1-840d-7b25c5ee775a', // UUID yang sudah ditentukan
        nama_dummy: 'Dummy 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dummy_id: '6c84fb90-12c4-11e1-840d-7b25c5ee775b', // UUID yang sudah ditentukan
        nama_dummy: 'Dummy 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        dummy_id: '6c84fb90-12c4-11e1-840d-7b25c5ee775c', // UUID yang sudah ditentukan
        nama_dummy: 'Dummy 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    // Hapus data dummy dari tabel dummy
    await queryInterface.bulkDelete('dummy', null, {});
  }
};
