const express = require("express");
const router = express.Router();
const SettingController = require("../controllers/SettingController");
const { verifyToken, adminOnly } = require("../middleware/AuthUser");

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
router.get("/userContent", verifyToken, SettingController.getUserContent);

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
  "/settings/defaultProfileImage",
  verifyToken,
  adminOnly,
  SettingController.insertDefaultProfileImage
);

/**
 * @swagger
 * /settings/defaultImageBatch:
 *   post:
 *     summary: Insert default image batch setting
 *     description: Add default image batch setting
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
 *               defaultImageBatch:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Setting added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating success
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: URL of the uploaded image batch
 *       422:
 *         description: Invalid Image Type or Image must be less than 5MB
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/defaultImageBatch",
  verifyToken,
  adminOnly,
  SettingController.insertDefaultImageBatch
);

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
 *       422:
 *         description: Invalid Image Type or Image must be less than 5MB
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/imageHomeUser",
  verifyToken,
  adminOnly,
  SettingController.insertImageHomeUser
);

/**
 * @swagger
 * /settings/linkDriveCV:
 *   post:
 *     summary: Insert link Google Drive CV setting
 *     description: Add link Google Drive CV setting
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
 *               linkDriveCV:
 *                 type: string
 *                 description: The Google Drive link for CV to be inserted
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/linkDriveCV",
  verifyToken,
  adminOnly,
  SettingController.insertLinkDriveCV
);

/**
 * @swagger
 * /settings/linkDriveCerti:
 *   post:
 *     summary: Insert link Google Drive certificate setting
 *     description: Add link Google Drive certificate setting
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
 *               linkDriveCerti:
 *                 type: string
 *                 description: The Google Drive link for certificate to be inserted
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/linkDriveCerti",
  verifyToken,
  adminOnly,
  SettingController.insertLinkDriveCerti
);

/**
 * @swagger
 * /settings/logoAdmin:
 *   post:
 *     summary: Insert admin logo setting
 *     description: Add admin logo setting
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
 *               adminLogo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Setting added successfully
 *       422:
 *         description: Invalid Image Type or Image must be less than 5MB
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/logoAdmin",
  verifyToken,
  adminOnly,
  SettingController.insertLogoAdmin
);

/**
 * @swagger
 * /settings/logoUser:
 *   post:
 *     summary: Insert user logo setting
 *     description: Add user logo setting
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
 *               userLogo:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Setting added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   description: Message indicating success
 *                 data:
 *                   type: object
 *                   properties:
 *                     url:
 *                       type: string
 *                       description: URL of the uploaded user logo
 *       422:
 *         description: Invalid Image Type or Image must be less than 5MB
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/logoUser",
  verifyToken,
  adminOnly,
  SettingController.insertLogoUser
);

/**
 * @swagger
 * /settings/defaultPassword:
 *   post:
 *     summary: Set default password
 *     description: Set the default password in the settings
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
 *               defaultPassword:
 *                 type: string
 *     responses:
 *       201:
 *         description: Default password set successfully
 *       500:
 *         description: Internal server error
 */
router.post(
  "/settings/defaultPassword",
  verifyToken,
  adminOnly,
  SettingController.insertDefaultPassword
);

module.exports = router;
