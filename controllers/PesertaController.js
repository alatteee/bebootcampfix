const Peserta = require("../models/Peserta.js"); // Sesuaikan path berdasarkan lokasi model Anda
const Batch = require("../models/Batch.js");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");

const PesertaController = {
  // Dapatkan semua peserta
  getParticipants: async (req, res) => {
    try {
      const participants = await Peserta.findAll({
        attributes: [
          "id",
          "peserta_id",
          "batch_id",
          "nama_peserta",
          "jenis_kelamin",
          "nomor_handphone",
          "alamat_rumah",
          "email",
          "tanggal_lahir",
          "link_github",
          "cv",
          "penilaian",
          "status",
          "hireBy",
          "image",
          "url",
        ],
        include: [
          {
            model: Batch, // Ganti Batch dengan nama model atau tabel yang berisi informasi batch
            attributes: ["kategori_batch"],
          },
        ],
        order: [["createdAt", "DESC"]], // Menambahkan urutan berdasarkan createdAt dari yang terbaru ke terlama

      });

      return res.status(200).json(participants);
    } catch (error) {
      console.error("Error fetching participants:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Dapatkan satu peserta berdasarkan ID
  getParticipantById: async (req, res) => {
    const id = req.params.id;

    try {
      const participant = await Peserta.findByPk(id, {
        attributes: [
          "id",
          "peserta_id",
          "batch_id",
          "nama_peserta",
          "jenis_kelamin",
          "default_password",
          "nomor_handphone",
          "alamat_rumah",
          "email",
          "tanggal_lahir",
          "link_github",
          "cv",
          "penilaian",
          "notes",
          "status",
          "hireBy",
          "image",
          "url",
          "createdAt",
        ],
      });

      if (!participant) {
        return res.status(404).json({ error: "Participant not found" });
      }

      return res.status(200).json(participant);
    } catch (error) {
      console.error(`Error fetching participant with ID ${id}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Unggah peserta
  createParticipant: async (req, res) => {
    try {
      // Validasi email unik
      const existingParticipant = await Peserta.findOne({
        where: {
          email: req.body.email,
        },
      });

      const jumlahPeserta = await Peserta.count({ paranoid: false });

      console.log("jml peserta", jumlahPeserta);

      console.log(existingParticipant);

      if (existingParticipant) {
        return res.status(422).json({ msg: "Email is already registered" });
      }

      // Set default password
      const defaultPassword = "bootcamp"; // Ganti dengan nilai default yang diinginkan
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Menentukan nilai default_password
      const isDefaultPassword = defaultPassword === "bootcamp";

      // Tambahkan pengguna dengan peran "user"
      const newUser = await User.create({
        nama: req.body.nama_peserta,
        email: req.body.email,
        role: "user",
        timestamp: new Date(),
      });

      let imageFile = req.files ? req.files.image : null;
      if (!imageFile) {
        let defaultImageFileName = "defaultForImage.jpg";

        // Check if default image file exists
        if (!fs.existsSync(`./public/images/${defaultImageFileName}`)) {
          // If not, use alternative default image
          defaultImageFileName = "undefined.jpg";
        }

        imageFile = {
          data: fs.readFileSync(`./public/images/${defaultImageFileName}`),
          name: defaultImageFileName,
          size: fs.statSync(`./public/images/${defaultImageFileName}`).size,
        };
      }

      console.log("image", imageFile);

      const imageExt = path.extname(imageFile.name);
      const imageFileName = imageFile.md5 + imageExt;
      const imageUrl = `/images/${imageFileName}`;
      const imageAllowedTypes = [".png", ".jpg", ".jpeg"];

      if (!imageAllowedTypes.includes(imageExt.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      console.log("image name", imageFileName);

      if (imageFile.data) {
        fs.writeFileSync(`./public/images/${imageFileName}`, imageFile.data);
      }

      if (newUser && newUser.user_id) {
        // Data peserta yang akan disimpan
        const participantData = {
          id: jumlahPeserta + 1,
          peserta_id: newUser.user_id,
          batch_id: req.body.batch_id || null,
          password_peserta: hashedPassword,
          default_password: isDefaultPassword, // Kolom default_password
          nama_peserta: newUser.nama,
          jenis_kelamin: req.body.jenis_kelamin || null,
          nomor_handphone: req.body.nomor_handphone,
          alamat_rumah: req.body.alamat_rumah,
          email: newUser.email,
          tanggal_lahir: req.body.tanggal_lahir || null,
          link_github: req.body.link_github,
          cv: req.body.cv || null,
          penilaian: req.body.penilaian || null,
          status: req.body.status || true,
          image: imageFileName,
          url: imageUrl,
        };

        // Simpan data ke database
        const newParticipant = await Peserta.create(participantData);

        return res.status(201).json(newParticipant);
      }
    } catch (error) {
      console.error("Error creating participant:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  gradingParticipant: async (req, res) => {
    const id = req.params.id;
    const { penilaian, notes } = req.body;

    try {
      // Validasi data yang diterima
      if (!id || (!penilaian && !notes)) {
        return res
          .status(400)
          .json({ msg: "Harap berikan data penilaian atau notes" });
      }

      const peserta = await Peserta.findByPk(id);

      if (!peserta) {
        return res.status(404).json({ msg: "Peserta tidak ditemukan" });
      }

      if (penilaian && notes !== "" && notes !== undefined && notes !== null) {
        const cleanedString = penilaian.replace(/\r?\n|\r/g, "");
        const separatedJsonStrings = cleanedString.split(/(?<=})\s*,\s*(?={)/);

        const parsedObjects = separatedJsonStrings.map((item) => {
          try {
            return JSON.parse(item);
          } catch (error) {
            console.error(`Error parsing JSON: ${item}`);
            return null; // Handle the error as needed
          }
        });

        // Simpan data penilaian dalam bentuk array
        await Peserta.update(
          { penilaian: parsedObjects, notes },
          { where: { id } }
        );

        return res.status(200).json({ msg: "Penilaian berhasil diupdate" });
      } else if (
        penilaian &&
        (notes === "" || notes === undefined || notes === null)
      ) {
        const cleanedString = penilaian.replace(/\r?\n|\r/g, "");
        const separatedJsonStrings = cleanedString.split(/(?<=})\s*,\s*(?={)/);

        const parsedObjects = separatedJsonStrings.map((item) => {
          try {
            return JSON.parse(item);
          } catch (error) {
            console.error(`Error parsing JSON: ${item}`);
            return null; // Handle the error as needed
          }
        });

        await Peserta.update({ penilaian: parsedObjects }, { where: { id } });

        return res.status(200).json({ msg: "Penilaian berhasil diupdate" });
      }
    } catch (error) {
      console.error("Error during grading participant:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
  },

  // Perbarui peserta
  updateParticipant: async (req, res) => {
    const id = req.params.id;

    try {
      // Periksa apakah peserta dengan ID yang diberikan ada
      const existingParticipant = await Peserta.findByPk(id);
      const existingUser = await User.findOne({
        where: { user_id: existingParticipant.peserta_id },
      });

      if (!existingParticipant) {
        return res.status(404).json({ msg: "Participant not found" });
      }

      // Check for duplicate email
      const newEmail = req.body.email;
      if (newEmail && newEmail !== existingParticipant.email) {
        const duplicateEmail = await Peserta.findOne({
          where: { email: newEmail },
        });

        if (duplicateEmail) {
          return res.status(400).json({ msg: "Email already exists" });
        }

        // Update email in User table
        await existingUser.update({ email: newEmail });
      }

      const existImageFileName = existingParticipant.image;
      let imageFileName;

      // Perbarui file gambar jika disediakan
      if (req.files !== null) {
        const imageFile = req.files.image;

        if (!imageFile) {
          return res.status(400).json({ msg: "Image file is missing" });
        }

        const imageSize = imageFile.data.length || imageFile.size;
        const imageExt = path.extname(imageFile.name);
        imageFileName = imageFile.md5 + imageExt;
        const allowedImageTypes = [".png", ".jpg", ".jpeg"];

        if (!allowedImageTypes.includes(imageExt.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (imageSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        console.log("image name:", imageFileName);
        console.log("exist image name:", existImageFileName);
        console.log(
          "exist image name boolean:",
          existImageFileName !== "undefined.jpg"
        );

        if (existImageFileName !== "undefined.jpg") {
          // Hapus file gambar lama sebelum menggantinya
          const imagePath = `./public/images/${existImageFileName}`;
          fs.unlinkSync(imagePath);
        }

        // Pindahkan file gambar baru ke direktori yang ditentukan
        imageFile.mv(`./public/images/${imageFileName}`, (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }
        });
      }

      // Tambahkan logika hireBy
      var hireBy = req.body.hireBy || existingParticipant.hireBy;

      // Jika hireBy sudah ada, gantilah dengan nilai yang baru
      if (existingParticipant.hireBy) {
        hireBy = req.body.hireBy || existingParticipant.hireBy;
      }

      // Perbarui data peserta di database
      const updatedParticipant = await existingParticipant.update({
        batch_id: req.body.batch_id || existingParticipant.batch_id,
        nama_peserta: req.body.nama_peserta || existingParticipant.nama_peserta,
        jenis_kelamin:
          req.body.jenis_kelamin || existingParticipant.jenis_kelamin,
        nomor_handphone:
          req.body.nomor_handphone || existingParticipant.nomor_handphone,
        alamat_rumah: req.body.alamat_rumah || existingParticipant.alamat_rumah,
        email: req.body.email || existingParticipant.email,
        tanggal_lahir:
          req.body.tanggal_lahir || existingParticipant.tanggal_lahir,
        link_github: req.body.link_github || existingParticipant.link_github,
        cv: req.body.cv || existingParticipant.cv,
        penilaian: req.body.penilaian || existingParticipant.penilaian,
        status: req.body.status || existingParticipant.status,
        hireBy,
        image: imageFileName || existingParticipant.image,
        url:
          imageFileName !== undefined
            ? `/images/${imageFileName}`
            : existingParticipant.url,
      });

      // Perbarui data pengguna jika nama_peserta diperbarui
      try {
        if (
          req.body.nama_peserta !== existingUser.nama &&
          req.body.nama_peserta !== null &&
          req.body.nama_peserta !== "" &&
          req.body.nama_peserta !== undefined
        ) {
          const updatedUser = await User.update(
            { nama: req.body.nama_peserta },
            { where: { user_id: existingParticipant.peserta_id } }
          );
          console.log("Participant ID:", existingParticipant.peserta_id);
          console.log("User updated:", updatedUser);
        }
      } catch (error) {
        console.error("Error updating user data:", error);
      }

      return res
        .status(200)
        .json({ msg: "Participant updated successfully", updatedParticipant });
    } catch (error) {
      console.error("Error updating participant:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Hapus peserta
  deleteParticipant: async (req, res) => {
    const id = req.params.id;

    try {
      // Periksa apakah peserta dengan ID yang diberikan ada
      const existingParticipant = await Peserta.findByPk(id);
      const existingUser = await User.findOne({
        where: { user_id: existingParticipant.peserta_id },
      });

      if (!existingParticipant) {
        return res.status(404).json({ msg: "Participant not found" });
      }

      // Tetapkan status ke false dan deletedAt ke waktu saat ini
      const updatedParticipant = await existingParticipant.update({
        status: false,
        deletedAt: new Date(),
      });

      const updatedUser = await existingUser.update({
        deletedAt: new Date(),
      });

      // Soft delete peserta
      const softDeleteParticipant = await updatedParticipant.destroy();
      const softDeleteUser = await updatedUser.destroy();

      return res.status(200).json({
        msg: "Participant soft deleted successfully",
        softDeleteParticipant,
        softDeleteUser,
      });
    } catch (error) {
      console.error("Error soft deleting participant:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Fungsi untuk mengubah status peserta berdasarkan ID
  changeStatus: async (req, res) => {
    const id = req.params.id;

    try {
      // Temukan peserta berdasarkan ID
      const participantToUpdate = await Peserta.findByPk(id);

      if (!participantToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Participant not found" });
      }

      // Toggle status (true to false, false to true)
      participantToUpdate.status = !participantToUpdate.status;

      // Simpan perubahan ke database
      await participantToUpdate.save();

      return res.status(200).json({
        success: true,
        message: "Participant status changed successfully",
      });
    } catch (error) {
      console.error("Error changing participant status:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  changePassword: async (req, res) => {
    const id = req.params.id;
    const newPassword = req.body.newPassword;
    const confPassword = req.body.confPassword;

    try {
      // Periksa apakah peserta dengan ID yang diberikan ada
      const existingParticipant = await Peserta.findByPk(id);

      if (!existingParticipant) {
        return res.status(404).json({ msg: "Participant not found" });
      }

      // Periksa apakah newPassword dan confPassword sesuai
      if (newPassword !== confPassword) {
        return res
          .status(400)
          .json({ msg: "New password and confirmation password do not match" });
      }

      // Periksa apakah password baru adalah "bootcamp"
      if (newPassword.toLowerCase() === "bootcamp") {
        return res
          .status(400)
          .json({ msg: "Cannot change password to default 'bootcamp'" });
      }

      // Periksa apakah password lama adalah "bootcamp"
      if (existingParticipant.password_peserta === "bootcamp") {
        return res
          .status(400)
          .json({ msg: "Cannot change password from default 'bootcamp'" });
      }

      // Hash newPassword
      const hashedNewPassword = await bcrypt.hash(newPassword, 15);

      // Perbarui password peserta di database dan set default_password menjadi false
      await existingParticipant.update({
        password_peserta: hashedNewPassword,
        default_password: false,
      });

      return res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
      console.error("Error changing password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  setImageDefault: async (req, res) => {
    const id = req.params.id; // Ambil id dari parameter request

    try {
      // Temukan peserta berdasarkan ID
      const participantToUpdate = await Peserta.findByPk(id);

      if (!participantToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Peserta tidak ditemukan" });
      }

      // Tentukan nama file default
      const defaultImageFileName = "undefined.jpg";

      // Ganti nama gambar peserta dengan gambar default
      participantToUpdate.image = defaultImageFileName;

      // Update URL gambar peserta menjadi URL gambar default
      participantToUpdate.url = `/images/${defaultImageFileName}`;

      // Simpan perubahan ke database
      await participantToUpdate.save();

      return res.status(200).json({
        success: true,
        message: "Gambar berhasil diubah menjadi default",
      });
    } catch (error) {
      console.error("Error changing participant image:", error);
      return res
        .status(500)
        .json({ success: false, message: "Terjadi kesalahan server" });
    }
  },
};

module.exports = PesertaController;
