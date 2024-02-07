'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('batch', [
      {
        batch_id: uuidv4(),
        kategori_batch: 'Batch 8',
        materi_batch: 'NodeJS',
        deskripsi_batch: 'Pelatihan pengembangan web',
        status_batch: true,
        image_batch: 'web_dev_image.jpg',
        url: 'web-development',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('batch', null, {});
  }
};
