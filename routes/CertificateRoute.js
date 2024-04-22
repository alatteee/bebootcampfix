const express = require("express");
const router = express.Router();
const CertificateController = require("../controllers/CertificateController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

/**
 * @swagger
 * tags:
 *   name: certificates
 *   description: Operations related to certificates
 */

/**
 * @swagger
 * /certificates:
 *   get:
 *     summary: Get all certificates
 *     description: Retrieve a list of all certificates
 *     tags: [certificates]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/certificates", verifyToken, CertificateController.getAllCertificates);

/**
 * @swagger
 * /certificates/{certificateId}:
 *   get:
 *     summary: Get a certificate by ID
 *     description: Retrieve a single certificate by its ID
 *     tags: [certificates]
 *     parameters:
 *       - in: path
 *         name: certificateId
 *         required: true
 *         description: ID of the certificate to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Certificate not found
 *       500:
 *         description: Internal server error
 */

router.get("/certificates/:certificateId", verifyToken, CertificateController.getCertificateById);

module.exports = router;
