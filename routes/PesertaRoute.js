const express = require("express");
const router = express.Router();
const PesertaController = require("../controllers/PesertaController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser")

/**
 * @swagger
 * tags:
 *   name: pesertas
 *   description: Operations related to pesertas
 */

/**
 * @swagger
 * /pesertas:
 *   get:
 *     summary: Get all pesertas
 *     description: Retrieve a list of all pesertas
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/pesertas", verifyToken, adminOnly, PesertaController.getParticipants);

/**
 * @swagger
 * /pesertas/{id}:
 *   get:
 *     summary: Get a peserta by ID
 *     description: Retrieve a single peserta by its ID
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the peserta to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Peserta not found
 *       500:
 *         description: Internal server error
 */

router.get("/pesertas/:id", verifyToken, PesertaController.getParticipantById);

/**
 * @swagger
 * /pesertas:
 *   post:
 *     summary: Create a new participant
 *     description: Upload participant information along with image and CV files
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               batch_id:
 *                 type: string
 *                 description: The ID of the batch to which the participant belongs
 *               nama_peserta:
 *                 type: string
 *                 description: The name of the participant
 *               jenis_kelamin:
 *                 type: string
 *                 enum:
 *                   - L
 *                   - P
 *                 description: The gender of the participant (L for Male, P for Female)
 *               nomor_handphone:
 *                 type: string
 *                 description: The phone number of the participant
 *               alamat_rumah:
 *                 type: string
 *                 description: The home address of the participant
 *               email:
 *                 type: string
 *                 description: The email address of the participant
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 description: The birthdate of the participant (YYYY-MM-DD)
 *               link_github:
 *                 type: string
 *                 description: The GitHub link of the participant
 *               penilaian:
 *                 type: string
 *                 description: The evaluation of the participant
 *               status:
 *                 type: boolean
 *                 description: The status of the participant
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The image file of the participant
 *               cv:
 *                 type: string
 *                 format: binary
 *                 description: The CV file of the participant
 *     responses:
 *       201:
 *         description: Participant created successfully
 *       400:
 *         description: Bad request - Image or CV file is missing
 *       422:
 *         description: Unprocessable Entity - Invalid Image or CV Type, or Image/CV exceeds 5MB
 *       500:
 *         description: Internal server error
 */
router.post("/pesertas", verifyToken, adminOnly, PesertaController.createParticipant);

/**
 * @swagger
 * /pesertas/{id}/grading:
 *   put:
 *     summary: Grade a participant
 *     description: Grade an existing participant based on its ID
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to be graded
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Give Grade to an Peserta
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               penilaian:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     nama_kategori:
 *                       type: string
 *                       description: Kategori penilaian
 *                     nilai:
 *                       type: number
 *                       description: Nilai penilaian
 *               notes:
 *                 type: string
 *                 description: Additional notes for the grading
 *             description: Array of participant grading data with optional notes
 *     responses:
 *       201:
 *         description: Participant graded successfully
 *       400:
 *         description: Bad request - Criteria values are missing
 *       404:
 *         description: Participant not found
 *       500:
 *         description: Internal server error
 */
router.put("/pesertas/:id/grading", verifyToken, adminOnly, PesertaController.gradingParticipant);

/**
 * @swagger
 * /pesertas/{id}:
 *   put:
 *     summary: Update a peserta by ID
 *     description: Update an existing peserta based on its ID
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the peserta to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated peserta object
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               batch_id:
 *                 type: string
 *                 description: The updated batch ID of the peserta
 *               nama_peserta:
 *                 type: string
 *                 description: The updated name of the peserta
 *               jenis_kelamin:
 *                 type: string
 *                 description: The updated gender of the peserta
 *                 enum:
 *                   - L
 *                   - P
 *               nomor_handphone:
 *                 type: string
 *                 description: The updated phone number of the peserta
 *               alamat_rumah:
 *                 type: string
 *                 description: The updated home address of the peserta
 *               email:
 *                 type: string
 *                 description: The updated email of the peserta
 *               tanggal_lahir:
 *                 type: string
 *                 format: date
 *                 description: The updated birthdate of the peserta
 *               link_github:
 *                 type: string
 *                 description: The updated GitHub link of the peserta
 *               cv:
 *                 type: string
 *                 description: The updated CV file of the peserta
 *               penilaian:
 *                 type: string
 *                 description: The updated evaluation of the peserta
 *               status:
 *                 type: boolean
 *                 description: The updated status of the peserta
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the peserta
 *               hireBy:
 *                 type: string
 *                 description: The updated hireBy information for the peserta
 *               linkCertificate:
 *                 type: string
 *                 description: The link of the certificate image file to be uploaded for the peserta
 *     responses:
 *       200:
 *         description: Peserta updated successfully
 *       404:
 *         description: Peserta not found
 *       500:
 *         description: Internal server error
 */

router.put("/pesertas/:id", verifyToken, PesertaController.updateParticipant);

/**
 * @swagger
 * /pesertas/{id}:
 *   delete:
 *     summary: Soft delete a peserta by ID
 *     description: Soft delete an existing peserta based on its ID
 *     tags: [pesertas]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the peserta to soft delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Peserta soft deleted successfully
 *       404:
 *         description: Peserta not found
 *       500:
 *         description: Internal server error
 */

router.delete("/pesertas/:id", verifyToken, adminOnly, PesertaController.deleteParticipant);

/**
 * @swagger
 * /pesertas/{id}:
 *   patch:
 *     summary: Change status of a participant by ID
 *     description: Change the status of an existing participant based on its ID
 *     tags: 
 *       - pesertas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to change status
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Participant status changed successfully
 *       '404':
 *         description: Participant not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/pesertas/:id", verifyToken, adminOnly, PesertaController.changeStatus);

/**
 * @swagger
 * /pesertas/{id}/changePassword:
 *   put:
 *     summary: Change password for a participant by ID
 *     description: Change the password of an existing participant based on its ID
 *     tags: 
 *       - pesertas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to change password
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
 *               currentPassword:
 *                 type: string
 *                 description: The current password of the participant
 *               newPassword:
 *                 type: string
 *                 description: The new password for the participant
 *               confPassword:
 *                 type: string
 *                 description: The confirmation of the new password
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *       '401':
 *         description: Current password is incorrect
 *       '404':
 *         description: Participant not found
 *       '400':
 *         description: New password and confirmation password do not match
 *       '500':
 *         description: Internal server error
 */
router.put("/pesertas/:id/changePassword", verifyToken, PesertaController.changePassword);

/**
 * @swagger
 * /pesertas/{id}/setImageDefault:
 *   patch:
 *     summary: Set participant image to default by ID
 *     description: Set the participant image to the default image ("defaultForImage.jpg") based on its ID
 *     tags: 
 *       - pesertas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to set image to default
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Participant image set to default successfully
 *       '404':
 *         description: Participant not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/pesertas/:id/setImageDefault", verifyToken, adminOnly, PesertaController.setImageDefault);

/**
 * @swagger
 * /pesertas/{id}/resetPassword:
 *   put:
 *     summary: Reset password for a participant by ID
 *     description: Reset the password of an existing participant based on its ID
 *     tags: 
 *       - pesertas
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the participant to reset password
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Password reset successfully
 *       '404':
 *         description: Participant not found
 *       '500':
 *         description: Internal server error
 */
router.put("/pesertas/:id/resetPassword", verifyToken, adminOnly, PesertaController.resetPassword);

module.exports = router;
