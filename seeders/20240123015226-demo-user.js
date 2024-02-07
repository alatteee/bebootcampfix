'use strict';

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash('wgsgws', 10);

    await queryInterface.bulkInsert('user', [
      {
        user_id: userId,
        nama: 'Mas',
        email: 'minda@gmail.com',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});

    await queryInterface.bulkInsert('pengajar', [
      {
        pengajar_id: userId,
        email_pengajar: 'minda@gmail.com',
        password_pengajar: hashedPassword,
        nama_pengajar: 'Mas',
        jenis_kelamin: 'L',
        profile_image: 'undefined.jpg',
        url: 'images/undefined.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    // Remove all data from User and Pengajar tables
    await queryInterface.bulkDelete('user', null, {});
    await queryInterface.bulkDelete('pengajar', null, {});
  }
};
