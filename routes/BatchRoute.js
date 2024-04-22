const express = require("express");
const router = express.Router();
const BatchController = require("../controllers/BatchController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

/**
 * @swagger
 * tags:
 *   name: batches
 *   description: Operations related to batches
 */

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Get all batches
 *     description: Retrieve a list of all batches
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/batches", verifyToken, adminOnly, BatchController.getBatches);

/**
 * @swagger
 * /batches/{batchId}:
 *   get:
 *     summary: Get a batch by ID
 *     description: Retrieve a single batch by its ID
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to retrieve
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

router.get("/batches/:batchId", verifyToken, adminOnly, BatchController.getBatchById);

/**
 * @swagger
 * /batches/getParticipantByBatch/{batchId}:
 *   get:
 *     summary: Get a participant by Batch ID
 *     description: Retrieve a single batch by its ID with participant
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to retrieve
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

router.get("/batches/getParticipantByBatch/:batchId", verifyToken, adminOnly, BatchController.getParticipantByBatch);

/**
 * @swagger
 * /batches/addParticipantsOnBatch/{batchId}:
 *   post:
 *     summary: Add participants to a batch
 *     description: Add multiple participants to a batch based on batch_id and an array of peserta_ids
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch where the participants will be added
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Batch and participant data to be added
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               peserta_ids:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of participant IDs to be added to the batch
 *     responses:
 *       200:
 *         description: Participants added to batch successfully
 *       400:
 *         description: Invalid request body
 *       404:
 *         description: Batch or participant not found
 *       500:
 *         description: Internal server error
 */
router.post("/batches/addParticipantsOnBatch/:batchId", verifyToken, adminOnly, BatchController.addParticipantOnBatch);

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Create a new batch
 *     description: Add a new batch to the system
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: Batch object to be added
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kategori_batch:
 *                 type: string
 *                 description: The category of the batch
 *               materi_batch:
 *                 type: string
 *                 description: The material of the batch
 *               deskripsi_batch:
 *                 type: string
 *                 description: The description of the batch
 *               deskripsi_batch_user:
 *                 type: string
 *                 description: The user description of the batch
 *               status_batch:
 *                 type: string
 *                 description: The status of the batch
 *               image_batch:
 *                 type: string
 *                 format: binary
 *                 description: The image file for the batch
 *     responses:
 *       201:
 *         description: Batch created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

router.post("/batches", verifyToken, adminOnly, BatchController.createBatch);

/**
 * @swagger
 * /batches/{batchId}:
 *   put:
 *     summary: Update a batch by ID
 *     description: Update an existing batch based on its ID
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated batch object
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               kategori_batch:
 *                 type: string
 *                 description: The updated category of the batch
 *               materi_batch:
 *                 type: string
 *                 description: The updated material of the batch
 *               deskripsi_batch:
 *                 type: string
 *                 description: The updated description of the batch
 *               deskripsi_batch_user:
 *                 type: string
 *                 description: The updated user description of the batch
 *               status_batch:
 *                 type: string
 *                 description: The updated status of the batch
 *               image_batch:
 *                 type: string
 *                 format: binary
 *                 description: The updated image file for the batch
 *     responses:
 *       200:
 *         description: Batch updated successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Internal server error
 */

router.put("/batches/:batchId", verifyToken, adminOnly, BatchController.updateBatch);

/**
 * @swagger
 * /batches/{batchId}:
 *   delete:
 *     summary: Delete a batch by ID
 *     description: Delete an existing batch based on its ID
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Batch deleted successfully
 *       404:
 *         description: Batch not found
 *       500:
 *         description: Internal server error
 */

router.delete("/batches/:batchId", verifyToken, adminOnly, BatchController.deleteBatch);

/**
 * @swagger
 * /batches/{batchId}:
 *   patch:
 *     summary: Change status of a batch by ID
 *     description: Change the status of an existing batch based on its ID
 *     tags: 
 *       - batches
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to change status
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Batch status changed successfully
 *       '404':
 *         description: Batch not found
 *       '500':
 *         description: Internal server error
 */
router.patch("/batches/:batchId", verifyToken, adminOnly, BatchController.changeStatus);

/**
 * @swagger
 * /batches/exportParticipantsByBatch/{batchId}:
 *   get:
 *     summary: Export participants of a batch to Excel
 *     description: Retrieve and export participants of a specific batch to an Excel file
 *     tags: [batches]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: batchId
 *         required: true
 *         description: ID of the batch to export participants
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully exported participants to Excel
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         description: Batch not found
 *         content:
 *           application/json:
 *             example:
 *               error: Batch not found
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal Server Error
 */
router.get("/batches/exportParticipantsByBatch/:batchId", verifyToken, adminOnly, BatchController.exportParticipantsByBatch);

module.exports = router;
