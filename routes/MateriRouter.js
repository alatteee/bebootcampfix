const express = require("express");
const router = express.Router();
const MateriController = require("../controllers/MateriController");

/**
 * @swagger
 * tags:
 *   name: materis
 *   description: Operations related to materis
 */

/**
 * @swagger
 * /materis:
 *   get:
 *     summary: Get all materis
 *     description: Retrieve a list of all materis
 *     tags: [materis]
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */

router.get("/materis", MateriController.getMateris);

/**
 * @swagger
 * /materis/{materiId}:
 *   get:
 *     summary: Get a materi by ID
 *     description: Retrieve a single materi by its ID
 *     tags: [materis]
 *     parameters:
 *       - in: path
 *         name: materiId
 *         required: true
 *         description: ID of the materi to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: Materi not found
 *       500:
 *         description: Internal server error
 */

router.get("/materis/:materiId", MateriController.getMateriById);

/**
 * @swagger
 * /materis:
 *   post:
 *     summary: Create a new materi
 *     description: Add a new materi to the system
 *     tags: [materis]
 *     requestBody:
 *       description: Materi object to be added
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_materi:
 *                 type: string
 *                 description: The name of the materi
 *     responses:
 *       201:
 *         description: Materi created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */

router.post("/materis", MateriController.createMateri);

/**
 * @swagger
 * /materis/{materiId}:
 *   put:
 *     summary: Update a materi by ID
 *     description: Update an existing materi based on its ID
 *     tags: [materis]
 *     parameters:
 *       - in: path
 *         name: materiId
 *         required: true
 *         description: ID of the materi to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated materi object
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama_materi:
 *                 type: string
 *                 description: The updated name of the materi
 *     responses:
 *       200:
 *         description: Materi updated successfully
 *       404:
 *         description: Materi not found
 *       500:
 *         description: Internal server error
 */

router.put("/materis/:materiId", MateriController.updateMateri);

/**
 * @swagger
 * /materis/{materiId}:
 *   delete:
 *     summary: Delete a materi by ID
 *     description: Delete an existing materi based on its ID
 *     tags: [materis]
 *     parameters:
 *       - in: path
 *         name: materiId
 *         required: true
 *         description: ID of the materi to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Materi deleted successfully
 *       404:
 *         description: Materi not found
 *       500:
 *         description: Internal server error
 */

router.delete("/materis/:materiId", MateriController.deleteMateri);

module.exports = router;
