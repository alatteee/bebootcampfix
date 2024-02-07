const express = require("express");
const router = express.Router();
const PengajarController = require("../controllers/PengajarController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser")

/**
 * @swagger
 * tags:
 *   name: pengajars
 *   description: Operations related to pengajars
 */

/**
 * @swagger
 * /pengajars:
 *   get:
 *     summary: Get all pengajars
 *     description: Retrieve a list of all pengajars
 *     tags: [pengajars]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/pengajars", verifyToken, adminOnly, PengajarController.getPengajars);

/**
 * @swagger
 * /pengajars/{id}:
 *   get:
 *     summary: Get a pengajar by ID
 *     description: Retrieve a single pengajar by its ID
 *     tags: [pengajars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pengajar to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Internal server error
 */

router.get("/pengajars/:id", verifyToken, adminOnly, PengajarController.getPengajarById);

/**
 * @swagger
 * /pengajars/{id}:
 *   put:
 *     summary: Update a pengajar by ID
 *     description: Update an existing pengajar based on its ID
 *     tags: [pengajars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pengajar to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated pengajar object
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_pengajar:
 *                 type: string
 *                 description: The updated name of the pengajar
 *               email_pengajar:
 *                 type: string
 *                 description: The updated email of the pengajar
 *               jenis_kelamin:
 *                 type: string
 *                 description: The updated gender of the pengajar
 *               profile_image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the pengajar
 *     responses:
 *       200:
 *         description: Pengajar updated successfully
 *       404:
 *         description: Pengajar not found
 *       500:
 *         description: Internal server error
 */

router.put("/pengajars/:id", verifyToken, adminOnly, PengajarController.updatePengajar);

/**
 * @swagger
 * /pengajars/{id}:
 *   delete:
 *     summary: Delete a pengajar by ID
 *     description: Delete an existing pengajar based on its ID
 *     tags: [pengajars]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pengajar to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pengajar deleted successfully
 *       404:
 *         description: Pengajar not found
 *       500:
 *         description: Internal server error
 */

router.delete("/pengajars/:id", verifyToken, adminOnly, PengajarController.deletePengajar);

/**
 * @swagger
 * /pengajars/{id}/changePassword:
 *   put:
 *     summary: Change password for a pengajar by ID
 *     description: Change the password of an existing pengajar based on its ID
 *     tags: 
 *       - pengajars
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the pengajar to change password
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated password information
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: The new password for the pengajar
 *               confPassword:
 *                 type: string
 *                 description: The confirmation of the new password
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '400':
 *         description: New password and confirmation password do not match
 *       '404':
 *         description: Pengajar not found
 *       '500':
 *         description: Internal server error
 */
router.put("/pengajars/:id/changePassword", verifyToken, PengajarController.changePassword);

module.exports = router;
