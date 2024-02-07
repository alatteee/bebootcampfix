const Materi = require("../models/Materi.js"); // Adjust the model path accordingly

const MateriController = {
  getMateris: async (req, res) => {
    try {
      const materis = await Materi.findAll({
        attributes: [
          "materi_id",
          "nama_materi",
        ],
      });

      return res.status(200).json(materis);
    } catch (error) {
      console.error("Error fetching materis:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getMateriById: async (req, res) => {
    const materiId = req.params.materiId;

    try {
      const materi = await Materi.findByPk(materiId, {
        attributes: [
          "materi_id",
          "nama_materi",
          "createdAt",
        ],
      });

      if (!materi) {
        return res.status(404).json({ error: "Materi not found" });
      }

      return res.status(200).json(materi);
    } catch (error) {
      console.error(`Error fetching materi with ID ${materiId}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createMateri: async (req, res) => {
    try {
      const { nama_materi } = req.body;
  
      // Check if Materi with the same name already exists
      const existingMateri = await Materi.findOne({
        where: { nama_materi },
      });
  
      if (existingMateri) {
        return res.status(400).json({ msg: "Materi with this name already exists" });
      }
  
      // Save data to the database
      const newMateri = await Materi.create({ nama_materi });
  
      return res.status(201).json(newMateri);
    } catch (error) {
      console.error("Error creating materi:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },  

  updateMateri: async (req, res) => {
    const materiId = req.params.materiId;

    try {
      // Check if materi with the given ID exists
      const existingMateri = await Materi.findByPk(materiId);

      if (!existingMateri) {
        return res.status(404).json({ msg: "Materi not found" });
      }

      // Update materi data in the database
      const updatedMateri = await existingMateri.update({
        nama_materi: req.body.nama_materi || existingMateri.nama_materi,
        // updatedAt: new Date(),
      });

      return res
        .status(200)
        .json({ msg: "Materi updated successfully", updatedMateri });
    } catch (error) {
      console.error("Error updating materi:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteMateri: async (req, res) => {
    const materiId = req.params.materiId;

    try {
      // Check if materi with the given ID exists
      const existingMateri = await Materi.findByPk(materiId);

      if (!existingMateri) {
        return res.status(404).json({ msg: "Materi not found" });
      }

      // Soft delete the materi
      const updatedMateri = await existingMateri.update({
        deletedAt: new Date(),
      });

      const softDeleteMateri = await updatedMateri.destroy();

      return res
        .status(200)
        .json({ msg: "Materi soft deleted successfully", softDeleteMateri });
    } catch (error) {
      console.error("Error soft deleting materi:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = MateriController;
