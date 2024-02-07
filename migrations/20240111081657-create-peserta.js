'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('peserta', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      peserta_id: {
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
        allowNull: false,
        unique: true,
      },
      batch_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'batch',
          key: 'batch_id',
        },
      },
      password_peserta: {
        type: Sequelize.STRING(255),
        defaultValue: 'bootcampwgs',
      },
      default_password: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      }, 
      nama_peserta: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      jenis_kelamin: {
        type: Sequelize.ENUM('L', 'P'),
        allowNull: true,
        defaultValue: 'L',
      },
      nomor_handphone: {
        type: Sequelize.STRING(20),
      },
      alamat_rumah: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      tanggal_lahir: {
        type: Sequelize.DATEONLY("YYYY-MM-DD"),
      },
      link_github: {
        type: Sequelize.STRING(255),
      },
      cv: {
        type: Sequelize.STRING(255),
      },
      penilaian: {
        type: Sequelize.ARRAY(Sequelize.JSON),
      },
      notes: {
        type: Sequelize.STRING(255), // Adjust the data type as needed
        allowNull: true, // Set to false if it should not allow null values
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      hireBy: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      image: {
        type: Sequelize.STRING(255),
      },
      url: {
        type: Sequelize.STRING(255),
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      deletedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('peserta');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_peserta_jenis_kelamin";');
  },
};
