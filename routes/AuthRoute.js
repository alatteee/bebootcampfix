const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { verifyToken } = require("../middleware/AuthUser");

/**
 * @swagger
 * tags:
 *   name: auth
 *   description: Operations related to auth
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Log in a user and obtain an authentication token
 *     tags: [auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: Password
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Authentication failed
 *       404:
 *         description: User or data not found
 */
router.post("/login", AuthController.Login);

/**
 * @swagger
 * /me:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user
 *     tags: [auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       401:
 *         description: Unauthorized - User not logged in
 *       404:
 *         description: User not found
 */
router.get("/me", verifyToken, AuthController.Me);

module.exports = router;
