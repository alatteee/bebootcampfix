const Certificate = require("../models/Certificate.js");
const User = require("../models/User.js");
const Batch = require("../models/Batch.js");
const path = require("path");
const fs = require("fs");

const CertificateController = {
  // Mendapatkan semua sertifikat
  getAllCertificates: async (req, res) => {
    try {
      const certificates = await Certificate.findAll();
      return res.status(200).json(certificates);
    } catch (error) {
      console.error("Error fetching certificates:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Mendapatkan satu sertifikat berdasarkan ID
  getCertificateById: async (req, res) => {
    const certificateId = req.params.certificateId;

    try {
      const certificate = await Certificate.findByPk(certificateId);
      if (!certificate) {
        return res.status(404).json({ error: "Certificate not found" });
      }

      return res.status(200).json(certificate);
    } catch (error) {
      console.error(
        `Error fetching certificate with ID ${certificateId}:`,
        error
      );
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = CertificateController;
