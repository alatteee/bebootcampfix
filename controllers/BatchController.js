const Batch = require("../models/Batch.js"); // Sesuaikan dengan path model Batch
const path = require("path");
const fs = require("fs");
const ExcelJS = require("exceljs");
const Peserta = require("../models/Peserta.js");
const Setting = require("../models/Setting.js");

// Fungsi capitalize untuk mengubah hanya huruf pertama dari setiap kata menjadi besar
const capitalize = (str) => {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

const BatchController = {
  // Mendapatkan semua batch
  getBatches: async (req, res) => {
    try {
      const batches = await Batch.findAll({
        attributes: [
          "batch_id",
          "kategori_batch",
          "materi_batch",
          "deskripsi_batch",
          "deskripsi_batch_user",
          "status_batch",
          "image_batch",
          "url",
        ],
        order: [["createdAt", "DESC"]],
      });

      return res.status(200).json(batches);
    } catch (error) {
      console.error("Error fetching batches:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Mendapatkan satu batch berdasarkan ID
  getBatchById: async (req, res) => {
    const batchId = req.params.batchId;

    try {
      const batch = await Batch.findByPk(batchId, {
        attributes: [
          "batch_id",
          "kategori_batch",
          "materi_batch",
          "deskripsi_batch",
          "deskripsi_batch_user",
          "status_batch",
          "image_batch",
          "url",
          "createdAt",
        ],
      });

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      return res.status(200).json(batch);
    } catch (error) {
      console.error(`Error fetching batch with ID ${batchId}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Mendapatkan peserta berdasarkan batch ID
  getParticipantByBatch: async (req, res) => {
    const batchId = req.params.batchId;

    try {
      // Temukan peserta berdasarkan batchId, diurutkan berdasarkan createdAt
      const participants = await Peserta.findAll({
        where: { batch_id: batchId },
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
        order: [["createdAt", "DESC"]], // Menambahkan urutan berdasarkan createdAt
      });

      return res.status(200).json(participants);
    } catch (error) {
      console.error(
        `Error fetching participants for batch with ID ${batchId}:`,
        error
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  addParticipantOnBatch: async (req, res) => {
    try {
      const { batchId } = req.params;
      var { peserta_ids } = req.body;

      // Temukan batch berdasarkan batch_id
      const batch = await Batch.findOne({
        where: { batch_id: batchId },
      });

      // Pastikan batch dengan batch_id yang diberikan ditemukan
      if (!batch) {
        return res.status(404).json({ msg: "Batch not found" });
      }

      // Ensure peserta_ids is an array
      if (!Array.isArray(peserta_ids)) {
        // Split the comma-separated string into an array
        peserta_ids = peserta_ids.split(",");
      }

      // Pastikan batch_id dan peserta_ids ada dalam request
      if (
        !batchId &&
        !peserta_ids &&
        Array.isArray(peserta_ids) &&
        peserta_ids.length === 0
      ) {
        return res.status(400).json({
          msg: "Batch ID and an array of participant IDs are required",
        });
      }

      for (const peserta_id of peserta_ids) {
        // Temukan peserta berdasarkan peserta_id
        const peserta = await Peserta.findOne({
          where: { peserta_id: peserta_id },
        });

        // Pastikan peserta dengan peserta_id yang diberikan ditemukan
        if (!peserta) {
          console.warn(
            `Participant with ID ${peserta_id} not found. Skipping.`
          );
          continue; // Skip to the next iteration if participant not found
        }

        // Periksa apakah peserta sudah memiliki batch_id
        if (peserta.batch_id) {
          // If peserta already has batch_id, update it with the new batch_id
          await Peserta.update(
            { batch_id: batchId },
            { where: { peserta_id: peserta_id } }
          );
        } else {
          // If peserta doesn't have batch_id, set it to the provided batchId
          peserta.batch_id = batchId;
          await peserta.save();
        }
      }

      return res
        .status(200)
        .json({ msg: "Participants added to batch successfully" });
    } catch (err) {
      console.error("Error adding participants to batch:", err);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Mengunggah batch
  createBatch: async (req, res) => {
    try {
      const { kategori_batch, deskripsi_batch_user } = req.body;

      const dataSettings = await Setting.count({ paranoid: false });

      // Mengonversi kategori_batch menjadi capitalize
      const capitalizedKategori = kategori_batch
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());

      const existingKategori = await Batch.findOne({
        where: { kategori_batch: capitalizedKategori },
      });

      if (existingKategori) {
        return res
          .status(400)
          .json({ msg: "Batch sudah ada, tolong ganti batch" });
      }

      // Data batch yang akan disimpan
      const batchData = {
        kategori_batch: capitalizedKategori,
        materi_batch: req.body.materi_batch,
        deskripsi_batch: req.body.deskripsi_batch,
        deskripsi_batch_user: deskripsi_batch_user, // Assign deskripsi_batch_user
        status_batch: req.body.status_batch || true,
      };

      let imageFile = req.files ? req.files.image_batch : null;
      let imageFileName;
      let imageUrl;
      let imageExt; // Definisikan variabel imageExt di sini

      if (!imageFile) {
        const dirPath = "./public/settings/default-image-batch/";
        const files = fs.readdirSync(dirPath);

        // Jika tidak ada file yang diunggah, gunakan default
        let defaultImageFileName = files[0];

        imageFile = {
          data: fs.readFileSync(
            `./public/settings/default-image-batch/${defaultImageFileName}`
          ),
          name: defaultImageFileName,
          size: fs.statSync(
            `./public/settings/default-image-batch/${defaultImageFileName}`
          ).size,
        };

        console.log("Using default image:", imageFile.name);

        imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini
        imageFileName = imageFile.name;
        imageUrl = `settings/default-image-batch/${imageFileName}`;
      } else {
        imageExt = path.extname(imageFile.name); // Inisialisasi imageExt di sini

        if (![".png", ".jpg", ".jpeg"].includes(imageExt.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        console.log("image", imageFile);

        if (req.files && imageFile.data) {
          // Pindahkan file ke direktori public/batch
          fs.writeFileSync(`./public/batch/${imageFileName}`, imageFile.data);
        }

        imageFileName = imageFile.md5 + imageExt;
        imageUrl = `batch/${imageFileName}`;
      }

      console.log("image ext", imageExt);
      console.log("image file name", imageFileName);
      console.log("image url", imageUrl);

      if (dataSettings < 1) {
        await Setting.create({
          default_image_batch: imageUrl,
        });
      }

      // Simpan data ke database
      const newBatch = await Batch.create({
        ...batchData,
        image_batch: imageFileName,
        url: imageUrl,
      });

      return res.status(201).json(newBatch);
    } catch (error) {
      console.error("Error creating batch:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateBatch: async (req, res) => {
    const batchId = req.params.batchId;

    try {
      // Cek apakah batch dengan ID yang diberikan ada
      const existingBatch = await Batch.findByPk(batchId);

      if (!existingBatch) {
        return res.status(404).json({ msg: "Batch not found" });
      }

      const existImageFileName = existingBatch.image_batch;
      let fileName;

      if (req.files !== null) {
        const file = req.files.image_batch;

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

        // Check if the participant is using the default profile image
        const isUsingDefaultImage = existingBatch.url.includes(
          "settings/default-profile-image/"
        );

        if (!isUsingDefaultImage) {
          // Delete the previous image if it's not the default profile image
          const imagePath = `./public/batch/${existingBatch.image_batch}`;
          if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
          } else {
            console.log("Previous image not found:", imagePath);
          }
        }

        // Pindahkan file baru ke direktori yang ditentukan
        file.mv(`./public/batch/${fileName}`, (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }
        });
      }

      // Validasi dan ubah kategori_batch menjadi capitalize
      const newCategory = req.body.kategori_batch
        ? capitalize(req.body.kategori_batch)
        : existingBatch.kategori_batch;

      // Cek apakah kategori_batch sudah ada di database
      const duplicateCategory = await Batch.findOne({
        where: { kategori_batch: newCategory },
      });

      if (duplicateCategory && duplicateCategory.batch_id !== batchId) {
        return res.status(422).json({ msg: "Duplicate category found" });
      }

      // Baca nilai deskripsi_batch_user dari permintaan
      const deskripsiBatchUser =
        req.body.deskripsi_batch_user || existingBatch.deskripsi_batch_user;

      // Update data batch di database
      const updatedBatch = await existingBatch.update({
        kategori_batch: newCategory,
        materi_batch: req.body.materi_batch || existingBatch.materi_batch,
        deskripsi_batch:
          req.body.deskripsi_batch || existingBatch.deskripsi_batch,
        deskripsi_batch_user: deskripsiBatchUser, // Tambahkan deskripsi_batch_user ke data yang diperbarui
        status_batch: req.body.status_batch || existingBatch.status_batch,
        image_batch: fileName || existingBatch.image_batch,
        url: fileName ? `batch/${fileName}` : existingBatch.url,
      });

      return res
        .status(200)
        .json({ msg: "Batch updated successfully", updatedBatch });
    } catch (error) {
      console.error("Error updating batch:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Menghapus batch
  deleteBatch: async (req, res) => {
    const batchId = req.params.batchId;

    try {
      // Cek apakah batch dengan ID yang diberikan ada
      const existingBatch = await Batch.findByPk(batchId);

      if (!existingBatch) {
        return res.status(404).json({ msg: "Batch not found" });
      }

      // Set status_batch menjadi false dan deletedAt menjadi waktu saat ini
      const updatedBatch = await existingBatch.update({
        status_batch: false,
        deletedAt: new Date(),
      });

      // Hapus file terkait jika tidak menggunakan default image
      const imagePath = `./public/batch/${existingBatch.image_batch}`;
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      } else {
        console.log("Batch image not found:", imagePath);
      }

      const softDeleteBatch = await updatedBatch.destroy();

      return res
        .status(200)
        .json({ msg: "Batch soft deleted successfully", softDeleteBatch });
    } catch (error) {
      console.error("Error soft deleting batch:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Fungsi untuk menonaktifkan batch berdasarkan ID batch
  changeStatus: async (req, res) => {
    const batchId = req.params.batchId;

    try {
      // Find batch by ID
      const batchToUpdate = await Batch.findByPk(batchId);
      const batchToUpdateParticipants = await Peserta.findAll({
        where: {
          batch_id: batchId,
        },
      });

      if (!batchToUpdate) {
        return res
          .status(404)
          .json({ success: false, message: "Batch not found" });
      }

      console.log("data batch to update: ", batchToUpdate);

      // Toggle the status (true to false, false to true)
      batchToUpdate.status_batch = !batchToUpdate.status_batch;

      // Save changes to the database
      await batchToUpdate.save();

      // If batch is disabled, disable all participants in the batch
      if (!batchToUpdate.status_batch) {
        if (batchToUpdateParticipants && batchToUpdateParticipants.length > 0) {
          // Disable all participants in the batch
          await Peserta.update(
            { status: false },
            {
              where: {
                peserta_id: batchToUpdateParticipants.map(
                  (participant) => participant.peserta_id
                ),
              },
            }
          );
        }
      } else if (batchToUpdate.status_batch) {
        if (batchToUpdateParticipants && batchToUpdateParticipants.length > 0) {
          // Disable all participants in the batch
          await Peserta.update(
            { status: true },
            {
              where: {
                peserta_id: batchToUpdateParticipants.map(
                  (participant) => participant.peserta_id
                ),
              },
            }
          );
        }
      }

      return res
        .status(200)
        .json({ success: true, message: "Batch status changed successfully" });
    } catch (error) {
      console.error("Error changing batch status:", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  },

  exportParticipantsByBatch: async (req, res) => {
    try {
      const { batchId } = req.params;

      // Temukan batch berdasarkan ID
      const batch = await Batch.findByPk(batchId);

      if (!batch) {
        return res.status(404).json({ error: "Batch not found" });
      }

      // Dapatkan semua peserta untuk batch tertentu
      const participants = await Peserta.findAll({
        where: { batch_id: batchId },
      });

      // Membuat workbook baru
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Participants");

      // Menambahkan header ke worksheet
      worksheet.addRow([
        "ID",
        "Nama Peserta",
        "Jenis Kelamin",
        "Nomor Handphone",
        "Alamat Rumah",
        "Email",
        "Tanggal Lahir",
        "Link Github",
        "CV",
        "Penilaian",
        "Status",
        "Hire By",
      ]);

      // Menambahkan data peserta ke worksheet
      participants.forEach((participant) => {
        worksheet.addRow([
          participant.id,
          participant.nama_peserta,
          participant.jenis_kelamin,
          participant.nomor_handphone,
          participant.alamat_rumah,
          participant.email,
          participant.tanggal_lahir,
          participant.link_github,
          participant.cv,
          participant.penilaian,
          participant.status,
          participant.hireBy,
        ]);
      });

      // Membuat nama file Excel
      const fileName = `participants_batch_${batchId}.xlsx`;

      // Menulis workbook ke file Excel
      await workbook.xlsx.writeFile(fileName);

      // Mengirim file Excel sebagai respon
      res.status(200).download(fileName, () => {
        // Hapus file setelah di-download
        fs.unlinkSync(fileName);
      });
    } catch (error) {
      console.error("Error exporting participants by batch:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = BatchController;
