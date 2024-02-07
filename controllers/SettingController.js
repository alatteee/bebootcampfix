const Setting = require("../models/Setting");

const SettingController = {
  insertDefaultProfileImage: async (req, res) => {
    try {
      if (req.files && Object.keys(req.files).length > 0) {
        const profileImage = req.files.defaultProfileImage;

        const fileSize = profileImage.data.length || profileImage.size;
        const ext = path.extname(profileImage.name);
        const fileName = profileImage.md5 + ext;
        const url = `/settings/${fileName}`; // URL file gambar profil
        const allowedTypes = [".png", ".jpg", ".jpeg"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        profileImage.mv(`./public/settings/${fileName}`, async (err) => {
          if (err) {
            return res.status(500).json({ msg: err.message });
          }

          const newSetting = await Setting.create({
            default_profile_image: url,
          });
          return res.status(201).json(newSetting);
        });
      } else {
        // Jika tidak ada file diunggah, gunakan gambar profil default
        const defaultProfileImageFileName = "default_profile_image.jpg"; // Nama file gambar profil default
        const defaultProfileImageUrl = `/settings/${defaultProfileImageFileName}`; // URL gambar profil default

        const newSetting = await Setting.create({
          default_profile_image: defaultProfileImageUrl,
        });

        return res.status(201).json(newSetting);
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertTextHomeUser: async (req, res) => {
    try {
      const { textHomeUser } = req.body;
      const newSetting = await Setting.create({ text_home_user: textHomeUser });
      return res.status(201).json(newSetting);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertImageHomeUser: async (req, res) => {
    try {
      const { imageHomeUser } = req.body;
      const newSetting = await Setting.create({
        image_home_user: imageHomeUser,
      });
      return res.status(201).json(newSetting);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertLinkGDrive: async (req, res) => {
    try {
      const { linkGDrive } = req.body;
      const newSetting = await Setting.create({ link_gdrive: linkGDrive });
      return res.status(201).json(newSetting);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = SettingController;
