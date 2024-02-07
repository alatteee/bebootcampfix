const Pengajar = require("../models/Pengajar.js"); // Sesuaikan dengan path model Pengajar
const path = require("path");
const fs = require("fs");
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

// Fungsi untuk memeriksa apakah email_pengajar sudah ada di tabel pengajar
const isEmailPengajarExists = async (emailPengajar) => {
  const existingPengajar = await Pengajar.findOne({
    where: { email_pengajar: emailPengajar },
  });
  return !!existingPengajar;
};

const PengajarController = {
  // Mendapatkan semua pengajar
  getPengajars: async (req, res) => {
    try {
      const pengajars = await Pengajar.findAll({
        attributes: [
          "id",
          "pengajar_id",
          "email_pengajar",
          "nama_pengajar",
          "jenis_kelamin",
          "profile_image",
          "url",
        ],
      });

      return res.status(200).json(pengajars);
    } catch (error) {
      console.error("Error fetching pengajars:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
  // Mendapatkan satu pengajar berdasarkan ID
  getPengajarById: async (req, res) => {
    const id = req.params.id; // Ubah sesuai dengan perubahan variabel

    try {
      const pengajar = await Pengajar.findByPk(id, {
        attributes: [
          "id",
          "pengajar_id",
          "email_pengajar",
          "nama_pengajar",
          "jenis_kelamin",
          "profile_image",
          "url",
          "createdAt",
        ],
      });

      if (!pengajar) {
        return res.status(404).json({ error: "Pengajar not found" });
      }

      return res.status(200).json(pengajar);
    } catch (error) {
      console.error(`Error fetching pengajar with ID ${id}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Perbarui pengajar
  updatePengajar: async (req, res) => {
    const id = req.params.id;

    try {
      // Periksa apakah pengajar dengan ID yang diberikan ada
      const existingPengajar = await Pengajar.findByPk(id);
      const existingUser = await User.findOne({
        where: { user_id: existingPengajar.pengajar_id },
      });

      if (!existingPengajar) {
        return res.status(404).json({ msg: "Pengajar not found" });
      }

      // Periksa apakah email_pengajar sudah ada di tabel pengajar

      if (
        req.body.email_pengajar !== "" &&
        req.body.email_pengajar !== undefined &&
        req.body.email_pengajar !== null
      ) {
        const isEmailExists = await isEmailPengajarExists(
          req.body.email_pengajar
        );

        if (
          isEmailExists &&
          req.body.email_pengajar !== existingPengajar.email_pengajar
        ) {
          return res.status(400).json({ msg: "Email pengajar already exists" });
        }
      }

      let fileName = existingPengajar.profile_image;

      // Perbarui file gambar jika disediakan
      if (req.files !== null) {
        const file = req.files.profile_image;

        if (!file) {
          return res.status(400).json({ msg: "File is missing" });
        }

        const fileSize = file.data.length || file.size;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        if (existingPengajar.image !== "undefined.jpg") {
          // Hapus file lama sebelum menggantinya
          const filePath = `./public/images/${existingPengajar.profile_image}`;
          fs.unlinkSync(filePath);
        }

        // Pindahkan file baru ke direktori yang ditentukan
        file.mv(`./public/images/${fileName}`, (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }
        });
      }

      const updatedPengajar = await existingPengajar.update({
        id: existingPengajar.id, // Pastikan menyertakan nilai id
        email_pengajar:
          req.body.email_pengajar || existingPengajar.email_pengajar,
        nama_pengajar: req.body.nama_pengajar || existingPengajar.nama_pengajar,
        jenis_kelamin: req.body.jenis_kelamin || existingPengajar.jenis_kelamin,
        profile_image: fileName,
        url: `/images/${fileName}`,
      });

      // Update data pengguna jika ada pembaruan email_pengajar
      try {
        if (
          req.body.email_pengajar !== existingUser.email &&
          req.body.email_pengajar !== "" &&
          req.body.email_pengajar !== undefined &&
          req.body.email_pengajar !== null
        ) {
          const updatedUser = await User.update(
            { email: req.body.email_pengajar },
            { where: { user_id: existingPengajar.pengajar_id } }
          );
          console.log("Pengajar ID:", existingPengajar.pengajar_id);
          console.log("User updated:", updatedUser);
        }

        // Update data pengguna jika ada pembaruan nama_pengajar
        if (
          req.body.nama_pengajar !== existingUser.nama &&
          req.body.nama_pengajar !== "" &&
          req.body.nama_pengajar !== undefined &&
          req.body.nama_pengajar !== null
        ) {
          const updatedUser = await User.update(
            { nama: req.body.nama_pengajar },
            { where: { user_id: existingPengajar.pengajar_id } }
          );
          console.log("Pengajar ID:", existingPengajar.pengajar_id);
          console.log("User updated:", updatedUser);
        }
      } catch (error) {
        console.error("Error updating user data:", error);
        // Tangani kesalahan sesuai kebutuhan, Anda dapat memilih untuk mencatatnya atau mengirim respons yang sesuai
      }

      return res
        .status(200)
        .json({ msg: "Pengajar updated successfully", updatedPengajar });
    } catch (error) {
      console.error("Error updating pengajar:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Menghapus batch
  deletePengajar: async (req, res) => {
    const id = req.params.id; // Ubah sesuai dengan perubahan variabel

    try {
      // Cek apakah pengajar dengan ID yang diberikan ada
      const existingPengajar = await Pengajar.findByPk(id);
      const existingUser = await User.findOne({
        where: { user_id: existingPengajar.pengajar_id },
      });

      if (!existingPengajar) {
        return res.status(404).json({ msg: "Pengajar not found" });
      }

      // Set status_batch menjadi false dan deletedAt menjadi waktu saat ini
      const updatedPengajar = await existingPengajar.update({
        status_batch: false,
        deletedAt: new Date(),
      });

      const updatedUser = await existingUser.update({
        deletedAt: new Date(),
      });

      const softDeletePengajar = await updatedPengajar.destroy();
      const softDeleteUser = await updatedUser.destroy();

      return res.status(200).json({
        msg: "Pengajar soft deleted successfully",
        softDeletePengajar,
        softDeleteUser,
      });
    } catch (error) {
      console.error("Error soft deleting pengajar:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.newPassword;
    const confPassword = req.body.confPassword;

    try {
      // Periksa apakah pengajar dengan ID yang diberikan ada
      const existingPengajar = await Pengajar.findByPk(id);

      if (!existingPengajar) {
        return res.status(404).json({ msg: "Pengajar not found" });
      }

      // Periksa apakah newPassword dan confPassword sesuai
      if (newPassword !== confPassword) {
        return res
          .status(400)
          .json({ msg: "New password and confirmation password do not match" });
      }

      // Hash newPassword
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);

      console.log("New Hash:", hashedNewPassword);

      // Perbarui password pengajar di database
      await existingPengajar.update({ password_pengajar: hashedNewPassword });

      return res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = PengajarController;
