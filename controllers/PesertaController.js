const Peserta = require("../models/Peserta.js"); // Sesuaikan path berdasarkan lokasi model Anda
const Batch = require("../models/Batch.js");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const User = require("../models/User.js");
const Setting = require("../models/Setting.js");
const Certificate = require("../models/Certificate.js");

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
          "id_certificate",
        ],
        include: [
          {
            model: Batch,
            attributes: ["kategori_batch", "materi_batch", "deskripsi_batch_user"],
          },
          {
            model: Certificate, // Tambahkan model Certificate di sini
            attributes: ["url"], // Ambil atribut URL dari sertifikat
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
          "id_certificate",
          "createdAt",
        ],
        include: [
          {
            model: Batch,
            attributes: ["kategori_batch", "materi_batch", "deskripsi_batch_user"],
          },
          {
            model: Certificate, // Tambahkan model Certificate di sini
            attributes: ["url"], // Ambil atribut URL dari sertifikat
          },
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
      const dataSettings = await Setting.count({ paranoid: false });

      console.log("jml peserta", jumlahPeserta);

      console.log(existingParticipant);

      if (existingParticipant) {
        return res.status(422).json({ msg: "Email is already registered" });
      }

      // Set default password
      const currentSetting = await Setting.findOne({ where: { id: 1 } });
      const defaultPassword = currentSetting
        ? currentSetting.default_password
        : "bootcamp";
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // Tambahkan pengguna dengan peran "user"
      const newUser = await User.create({
        nama: req.body.nama_peserta,
        email: req.body.email,
        role: "user",
        timestamp: new Date(),
      });

      let imageFile = req.files ? req.files.image : null;
      let imageUrl;
      let imageFileName;
      let imageExt; // Definisikan variabel imageExt di sini

      if (!imageFile) {
        const dirPath = "./public/settings/default-profile-image/";
        const files = fs.readdirSync(dirPath);

        // If there are no files in the directory, set a default file name
        let defaultImageFileName = files[0];

        imageFile = {
          data: fs.readFileSync(
            `./public/settings/default-profile-image/${defaultImageFileName}`
          ),
          name: defaultImageFileName,
          size: fs.statSync(
            `./public/settings/default-profile-image/${defaultImageFileName}`
          ).size,
          md5: null, // Set md5 to null for default image
        };

        console.log("image", imageFile.name);

        imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini
        imageFileName = imageFile.name;
        imageUrl = `settings/default-profile-image/${imageFileName}`;
      } else {
        imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini

        if (![".png", ".jpg", ".jpeg"].includes(imageExt.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        console.log("image", imageFile);

        if (req.files && imageFile.data) {
          fs.writeFileSync(
            `./public/participant/${imageFileName}`,
            imageFile.data
          );
        }

        imageFileName = imageFile.md5 + imageExt;
        imageUrl = `participant/${imageFileName}`;
      }

      console.log("image ext", imageExt);
      console.log("image file name", imageFileName);
      console.log("image url", imageUrl);

      if (newUser && newUser.user_id) {
        // Data peserta yang akan disimpan
        const participantData = {
          id: jumlahPeserta + 1,
          peserta_id: newUser.user_id,
          batch_id: req.body.batch_id || null,
          password_peserta: hashedPassword,
          default_password: true, // Kolom default_password
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
          id_certificate: req.body.id_certificate || null,
        };

        if (dataSettings < 1) {
          await Setting.create({
            default_profile_image: imageUrl,
          });
        }

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

        // Check if the participant is using the default profile image
        const isUsingDefaultImage = existingParticipant.url.includes(
          "settings/default-profile-image/"
        );

        if (!isUsingDefaultImage) {
          // Delete the previous image if it's not the default profile image
          const imagePath = `./public/participant/${existImageFileName}`;
          fs.unlinkSync(imagePath);
        }

        // Pindahkan file gambar baru ke direktori yang ditentukan
        imageFile.mv(`./public/participant/${imageFileName}`, (err) => {
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

      // Mengubah format nomor handphone
      let nomorHandphone = existingParticipant.nomor_handphone;

      if (req.body.nomor_handphone) {
        nomorHandphone = req.body.nomor_handphone;

        // Cek apakah nomor_handphone dimulai dengan "08"
        if (nomorHandphone.startsWith("08")) {
          nomorHandphone = "62" + nomorHandphone.slice(1);
        }
      }

      // Ambil file sertifikat dari request
      const linkCertificate = req.body.linkCertificate;

      // Simpan sertifikat ke dalam database dengan peserta_id yang ditemukan
      let certificateId;
      let certificateUrl;
      if (linkCertificate) {
        // Cek apakah sertifikat sudah ada
        const existingCertificate = await Certificate.findOne({
          where: { peserta_id: existingParticipant.peserta_id },
        });

        if (existingCertificate) {
          // Update url jika sertifikat sudah ada
          await existingCertificate.update({ url: linkCertificate });
          certificateId = existingCertificate.id;
          certificateUrl = linkCertificate;
        } else {
          // Buat sertifikat baru jika belum ada
          const certificate = await Certificate.create({
            peserta_id: existingParticipant.peserta_id,
            url: linkCertificate,
          });
          certificateId = certificate.id;
          certificateUrl = linkCertificate;
        }
      }

      // Perbarui data peserta di database
      const updatedParticipant = await existingParticipant.update({
        batch_id: req.body.batch_id || existingParticipant.batch_id,
        nama_peserta: req.body.nama_peserta || existingParticipant.nama_peserta,
        jenis_kelamin:
          req.body.jenis_kelamin || existingParticipant.jenis_kelamin,
        nomor_handphone: nomorHandphone,
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
            ? `/participant/${imageFileName}`
            : existingParticipant.url,
        id_certificate: linkCertificate ? certificateId : null, // Jika linkCertificate tidak diisi, set id_certificate menjadi null
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

      return res.status(200).json({
        msg: "Participant updated successfully",
        updatedParticipant,
      });
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

      // Hapus file gambar peserta jika bukan default image
      const isUsingDefaultImage = existingParticipant.url.includes(
        "settings/default-profile-image/"
      );

      if (!isUsingDefaultImage) {
        const imagePath = `./public/participant/${existingParticipant.image}`;
        fs.unlinkSync(imagePath);
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
    const currentPassword = req.body.currentPassword;
    const newPassword = req.body.newPassword;
    const confPassword = req.body.confPassword;

    try {
      // Periksa apakah peserta dengan ID yang diberikan ada
      const existingParticipant = await Peserta.findByPk(id);

      if (!existingParticipant) {
        return res.status(404).json({ msg: "Participant not found" });
      }

      // Periksa apakah currentPassword sesuai dengan password di database
      const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        existingParticipant.password_peserta
      );

      if (!isPasswordMatch) {
        return res.status(400).json({ msg: "Current password is incorrect" });
      }

      // Periksa apakah newPassword dan confPassword sesuai
      if (newPassword !== confPassword) {
        return res.status(400).json({
          msg: "New password and confirmation password do not match",
        });
      }

      // Periksa panjang newPassword
      if (newPassword.length < 8 || newPassword.length > 16) {
        return res.status(400).json({
          msg: "Password length must be between 8 and 16 characters",
        });
      }

      // Periksa apakah password baru sama dengan default_password
      const defaultPassword = await Setting.findOne({ where: { id: 1 } });
      if (defaultPassword && newPassword === defaultPassword.default_password) {
        return res.status(400).json({
          msg: "Cannot change password to default password",
        });
      }

      // Hash newPassword
      const hashedNewPassword = await bcrypt.hash(newPassword, 15);

      // Perbarui password peserta di database
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
        return res.status(404).json({
          success: false,
          message: "Peserta tidak ditemukan",
        });
      }

      // Tentukan nama file default dari folder settings/default-profile-image
      const dirPath = "./public/settings/default-profile-image/";
      const files = fs.readdirSync(dirPath);
      const defaultImageFileName = files[0]; // Mengambil nama file pertama dalam direktori

      // Ganti nama gambar peserta dengan gambar default
      participantToUpdate.image = defaultImageFileName;

      // Update URL gambar peserta menjadi URL gambar default
      participantToUpdate.url = `settings/default-profile-image/${defaultImageFileName}`;

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

  insertCertificate: async (req, res) => {
    try {
      const { id } = req.body;

      // Cari peserta berdasarkan id yang diberikan
      const peserta = await Peserta.findByPk(id);
      if (!peserta) {
        return res.status(404).json({ error: "Peserta not found" });
      }

      // Ambil id dan peserta_id dari peserta
      const { id: pesertaId, peserta_id: pesertaIdFromTable } = peserta;

      // Ambil file sertifikat dari request
      const imageCertificate = req.files.imageCertificate;

      // Periksa ekstensi file gambar
      const imageExt = path.extname(imageCertificate.name);
      const imageAllowedTypes = [".png", ".jpg", ".jpeg"];
      if (!imageAllowedTypes.includes(imageExt.toLowerCase())) {
        return res.status(422).json({ error: "Invalid Image Type" });
      }

      // Generate nama unik untuk file gambar
      const imageFileName = imageCertificate.md5 + imageExt;

      // Simpan sertifikat ke dalam database dengan peserta_id yang ditemukan
      const certificate = await Certificate.create({
        peserta_id: pesertaIdFromTable, // Menggunakan peserta_id dari tabel
        image_certificate: imageFileName,
        url: `/certificate/${imageFileName}`,
      });

      // Simpan file sertifikat
      imageCertificate.mv(
        `./public/certificate/${imageFileName}`,
        async (err) => {
          if (err) {
            console.error("Error saving certificate image:", err);
            return res
              .status(500)
              .json({ error: "Failed to save certificate image" });
          }

          // Update kolom id_certificate di tabel Peserta
          await peserta.update({ id_certificate: certificate.id });

          return res.status(201).json({
            success: true,
            message: "Certificate uploaded successfully",
          });
        }
      );
    } catch (error) {
      console.error("Error uploading certificate:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { id } = req.params;

      // Dapatkan default password dari pengaturan
      const setting = await Setting.findOne({ where: { id: 1 } });
      const defaultPassword = setting ? setting.default_password : "bootcamp";

      if (!defaultPassword) {
        return res.status(500).json({ error: "Default password not found" });
      }

      // Temukan peserta berdasarkan ID
      const peserta = await Peserta.findByPk(id);
      if (!peserta) {
        return res.status(404).json({ error: "Peserta not found" });
      }

      // Hash default password
      const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);

      // Ubah password_peserta peserta menjadi default_password
      await peserta.update({
        password_peserta: hashedDefaultPassword,
        default_password: true, // Update kolom default_password menjadi true
      });

      return res.status(200).json({ msg: "Password reset successfully" });
    } catch (error) {
      console.error("Error resetting password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = PesertaController;
