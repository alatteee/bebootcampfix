"use strict";

const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

module.exports = {
  async up(queryInterface, Sequelize) {
    const userId = uuidv4();
    const hashedPassword = await bcrypt.hash("wgs12345", 10);

    const dirPath = "./public/settings/default-profile-image/";
    const files = fs.readdirSync(dirPath);

    let defaultImageFileName = files[0];

    const imageFile = {
      data: fs.readFileSync(
        `./public/settings/default-profile-image/${defaultImageFileName}`
      ),
      name: defaultImageFileName,
      size: fs.statSync(
        `./public/settings/default-profile-image/${defaultImageFileName}`
      ).size,
    };

    await queryInterface.bulkInsert(
      "user",
      [
        {
          user_id: userId,
          nama: "Mas Avit",
          email: "admin3@gmail.com",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "pengajar",
      [
        {
          pengajar_id: userId,
          email_pengajar: "admin3@gmail.com",
          password_pengajar: hashedPassword,
          nama_pengajar: "Mas Avit",
          jenis_kelamin: "L",
          profile_image: imageFile.name,
          url: `settings/default-profile-image/${imageFile.name}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      "setting",
      [
        {
          default_profile_image: `settings/default-profile-image/${imageFile.name}`,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    // Remove all data from User and Pengajar tables
    await queryInterface.bulkDelete("user", null, {});
    await queryInterface.bulkDelete("pengajar", null, {});
    await queryInterface.bulkDelete("setting", null, {});
  },
};
