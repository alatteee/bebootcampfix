'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('wgsgws', 10);

    return queryInterface.bulkInsert('pengajar', [
      {
        pengajar_id: uuidv4(),
        email_pengajar: 'john.doe@example.com',
        password_pengajar: hashedPassword,
        nama_pengajar: 'John Doe',
        jenis_kelamin: 'L',
        profile_image: 'Kepo',
        url: 'Kepo',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('pengajar', null, {});
  }
};
