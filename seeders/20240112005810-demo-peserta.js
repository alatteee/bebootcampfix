'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('bootcamp', 10);

    return queryInterface.bulkInsert('peserta', [
      {
        peserta_id: uuidv4(),
        batch_id: '0e19792d-17a3-4ac8-9594-8b1c20097646', // Sesuaikan dengan batch_id yang ada di tabel batch
        password_peserta: hashedPassword,
        nama_peserta: 'Alice Doe',
        jenis_kelamin: 'P',
        nomor_handphone: '123456789',
        alamat_rumah: 'Jl. Contoh No. 123',
        email: 'alice.doe@example.com',
        tanggal_lahir: '1990-01-01',
        link_github: 'https://github.com/alice-doe',
        cv: 'cv_file.pdf',
        penilaian: JSON.stringify({ nilai: 85, catatan: 'Prestasi cukup baik' }),
        status: true,
        image: 'alice_image.jpg',
        url: 'alice-doe',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('peserta', null, {});
  }
};
