const Batch = require("../models/Batch.js"); // Sesuaikan dengan path model Batch
const path = require("path");
const fs = require("fs");
const Peserta = require("../models/Peserta.js");

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
          "status_batch",
          "image_batch",
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

  // Mengupload batch
  createBatch: async (req, res) => {
    try {
      const { kategori_batch } = req.body;

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
        kategori_batch: capitalize(req.body.kategori_batch),
        materi_batch: req.body.materi_batch,
        deskripsi_batch: req.body.deskripsi_batch,
        status_batch: req.body.status_batch || true,
      };

      // Jika ada file yang diunggah, proses file
      if (req.files && Object.keys(req.files).length > 0) {
        const imageFile = req.files.image_batch;

        const fileSize = imageFile.data.length || imageFile.size;
        const ext = path.extname(imageFile.name);
        const fileName = imageFile.md5 + ext;
        const url = `/images/${fileName}`;
        const allowedType = [".png", ".jpg", ".jpeg"];

        if (!allowedType.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        imageFile.mv(`./public/images/${fileName}`, async (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }

          // Setelah file terunggah, tambahkan informasi file ke data batch
          batchData.image_batch = fileName;
          batchData.url = url;

          // Simpan data ke database
          const newBatch = await Batch.create(batchData);

          return res.status(201).json(newBatch);
        });
      } else {
        // Jika tidak ada file diunggah, gunakan default image_batch
        const defaultImageFileName = "undefined.jpg";
        const defaultImageUrl = `/images/${defaultImageFileName}`;

        batchData.image_batch = defaultImageFileName;
        batchData.url = defaultImageUrl;

        // Simpan data ke database
        const newBatch = await Batch.create(batchData);

        return res.status(201).json(newBatch);
      }
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

        if (existImageFileName !== "undefined.jpg") {
          // Hapus file lama sebelum menggantinya
          const filePath = `./public/images/${existImageFileName}`;
          fs.unlinkSync(filePath);
        }

        // Pindahkan file baru ke direktori yang ditentukan
        file.mv(`./public/images/${fileName}`, (err) => {
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

      // Update data batch di database
      const updatedBatch = await existingBatch.update({
        kategori_batch: newCategory,
        materi_batch: req.body.materi_batch || existingBatch.materi_batch,
        deskripsi_batch:
          req.body.deskripsi_batch || existingBatch.deskripsi_batch,
        status_batch: req.body.status_batch || existingBatch.status_batch,
        image_batch: fileName || existingBatch.image_batch,
        url: fileName ? `/images/${fileName}` : existingBatch.url,
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
};

module.exports = BatchController;
