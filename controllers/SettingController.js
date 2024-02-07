const Setting = require('../models/Setting')
const path = require('path')
const fs = require('fs')
const Peserta = require('../models/Peserta')

const SettingController = {
	insertDefaultProfileImage: async (req, res) => {
		try {
			if (req.files && Object.keys(req.files).length > 0) {
				const profileImage = req.files.defaultProfileImage

				const fileSize = profileImage.data.length || profileImage.size
				const ext = path.extname(profileImage.name)
				const fileName = 'undefined' + ext
				const url = `/settings/default-profile-image/${fileName}` // URL file gambar profil
				const allowedTypes = ['.png', '.jpg', '.jpeg']

				if (!allowedTypes.includes(ext.toLowerCase())) {
					return res.status(422).json({ msg: 'Invalid Image Type' })
				}

				if (fileSize > 5000000) {
					return res
						.status(422)
						.json({ msg: 'Image must be less than 5MB' })
				}

				// Read the directory and delete any existing image files
				const files = fs.readdirSync(
					'./public/settings/default-profile-image'
				)
				for (const file of files) {
					if (
						allowedTypes.includes(path.extname(file).toLowerCase())
					) {
						fs.unlinkSync(
							path.join(
								'./public/settings/default-profile-image/',
								file
							)
						)
					}
				}

				if (profileImage) {
					fs.writeFileSync(
						`./public/settings/default-profile-image/${fileName}`,
						profileImage.data
					)
				}

				// Fetch the current default profile image name from settings
				const currentDefaultImageSettings = await Setting.findOne({
					attributes: ['default_profile_image', 'id'],
				})

				// Identify all participants with the current default profile image
				const participantsWithDefaultImage = await Peserta.findAll({
					where: {
						url: currentDefaultImageSettings.default_profile_image,
					},
				})

				// Update the image details for each participant
				const updatedParticipants = await Promise.all(
					participantsWithDefaultImage.map(async (participant) => {
						const updatedParticipant = await Peserta.update(
							{
								image: fileName,
								url: `/settings/default-profile-image/${fileName}`,
							},
							{ where: { peserta_id: participant.peserta_id } }
						)
						return updatedParticipant
					})
				)

				// Simpan data ke database
				const newProfileImage = await Setting.update(
					{
						default_profile_image: url,
					},
					{ where: { id: currentDefaultImageSettings.id } }
				)

				return res
					.status(201)
					.json({
						msg: 'Successfully Updated Default Profile Image!',
					})
			} else {
				return res
					.status(500)
					.json({ message: 'Provide Default Image Please!' })
			}
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	insertTextHomeUser: async (req, res) => {
		try {
			const { textHomeUser } = req.body
			const newSetting = await Setting.create({
				text_home_user: textHomeUser,
			})
			return res.status(201).json(newSetting)
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	insertImageHomeUser: async (req, res) => {
		try {
			const { imageHomeUser } = req.body
			const newSetting = await Setting.create({
				image_home_user: imageHomeUser,
			})
			return res.status(201).json(newSetting)
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},

	insertLinkGDrive: async (req, res) => {
		try {
			const { linkGDrive } = req.body
			const newSetting = await Setting.create({ link_gdrive: linkGDrive })
			return res.status(201).json(newSetting)
		} catch (error) {
			return res.status(500).json({ message: error.message })
		}
	},
}

module.exports = SettingController
