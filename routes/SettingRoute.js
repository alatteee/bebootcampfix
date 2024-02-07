const express = require('express')
const router = express.Router()
const SettingController = require('../controllers/SettingController')
const { verifyToken, adminOnly } = require('../middleware/AuthUser')

/**
 * @swagger
 * tags:
 *   name: settings
 *   description: Operations related to settings
 * securityDefinitions:
 *   BearerAuth:
 *     type: apiKey
 *     in: header
 *     name: Authorization
 */

/**
 * @swagger
 * /userContent:
 *   get:
 *     summary: Get all user dashboard content
 *     description: Retrieve a list of user dashboard content
 *     tags: [settings]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *       500:
 *         description: Internal server error
 */
router.get('/userContent', verifyToken, SettingController.getUserContent)

/**
 * @swagger
 * /settings/defaultProfileImage:
 *   post:
 *     summary: Insert default profile image setting
 *     description: Add default profile image setting
 *     tags: [settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               defaultProfileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
	'/settings/defaultProfileImage',
	verifyToken,
	adminOnly,
	SettingController.insertDefaultProfileImage
)

/**
 * @swagger
 * /settings/textHomeUser:
 *   post:
 *     summary: Insert text home user setting
 *     description: Add text home user setting
 *     tags: [settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               textHomeUser:
 *                 type: string
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
	'/settings/textHomeUser',
	verifyToken,
	adminOnly,
	SettingController.insertTextHomeUser
)

/**
 * @swagger
 * /settings/imageHomeUser:
 *   post:
 *     summary: Insert image home user setting
 *     description: Add image home user setting
 *     tags: [settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               imageHomeUser:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
	'/settings/imageHomeUser',
	verifyToken,
	adminOnly,
	SettingController.insertImageHomeUser
)

/**
 * @swagger
 * /settings/linkGDrive:
 *   post:
 *     summary: Insert link GDrive setting
 *     description: Add link GDrive setting
 *     tags: [settings]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               linkGDrive:
 *                 type: string
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
	'/settings/linkGDrive',
	verifyToken,
	adminOnly,
	SettingController.insertLinkGDrive
)

module.exports = router
