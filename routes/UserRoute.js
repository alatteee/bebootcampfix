const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser")

/**
 * @swagger
 * tags:
 *   name: users
 *   description: Operations related to users
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     tags: [users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Internal server error
 */

router.get("/users", verifyToken, adminOnly, UserController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     description: Retrieve a single user by its ID
 *     tags: [users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */

router.get("/users/:id", UserController.getUserById);

module.exports = router;
