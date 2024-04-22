const Setting = require("../models/Setting");
const path = require("path");
const fs = require("fs");
const Peserta = require("../models/Peserta");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Pengajar = require("../models/Pengajar");
const Batch = require("../models/Batch");

const SettingController = {
  getUserContent: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const userId = decodedToken.userId;

      const user = await User.findOne({
        attributes: ["role"],
        where: { user_id: userId },
      });

      if (user.role === "user") {
        const contents = await Setting.findOne({
          attributes: [
            "image_home_user",
            "link_drive_cv",
            "link_drive_certi",
            "image_logo_user",
          ],
        });

        return res.status(200).json({ contents });
      }

      if (user.role === "admin") {
        const contents = await Setting.findOne({
          attributes: [
            "image_home_user",
            "default_profile_image",
            "default_image_batch",
            "link_drive_cv",
            "link_drive_certi",
            "image_logo_admin",
            "image_logo_user",
            "default_password",
          ],
        });

        return res.status(200).json({ contents });
      }
    } catch (error) {
      console.error("Error fetching batches:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  insertDefaultProfileImage: async (req, res) => {
    try {
      if (req.files && Object.keys(req.files).length > 0) {
        const profileImage = req.files.defaultProfileImage;

        const fileSize = profileImage.data.length || profileImage.size;
        const ext = path.extname(profileImage.name);
        const fileName = profileImage.md5 + ext;
        const url = `settings/default-profile-image/${fileName}`; // URL file gambar profil
        const allowedTypes = [".png", ".jpg", ".jpeg"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        // Read the directory and delete any existing image files
        const files = fs.readdirSync("./public/settings/default-profile-image");
        for (const file of files) {
          if (allowedTypes.includes(path.extname(file).toLowerCase())) {
            fs.unlinkSync(
              path.join("./public/settings/default-profile-image/", file)
            );
          }
        }

        if (profileImage) {
          fs.writeFileSync(
            `./public/settings/default-profile-image/${fileName}`,
            profileImage.data
          );
        }

        // Fetch the current default profile image name from settings
        const currentDefaultImageSettings = await Setting.findOne({
          attributes: ["default_profile_image", "id"],
        });

        // Identify all participants with the current default profile image
        const participantsWithDefaultImage = await Peserta.findAll({
          where: {
            url: currentDefaultImageSettings.default_profile_image,
          },
        });

        // Identify all teachers with the current default profile image
        const teachersWithDefaultImage = await Pengajar.findAll({
          where: {
            url: currentDefaultImageSettings.default_profile_image,
          },
        });

        // Update the image details for each participant
        const updatedParticipants = await Promise.all(
          participantsWithDefaultImage.map(async (participant) => {
            const updatedParticipant = await Peserta.update(
              {
                image: fileName,
                url: `settings/default-profile-image/${fileName}`,
              },
              { where: { peserta_id: participant.peserta_id } }
            );
            return updatedParticipant;
          })
        );

        // Update the image details for each teacher
        const updatedTeachers = await Promise.all(
          teachersWithDefaultImage.map(async (teacher) => {
            const updatedTeacher = await Pengajar.update(
              {
                profile_image: fileName,
                url: `settings/default-profile-image/${fileName}`,
              },
              { where: { pengajar_id: teacher.pengajar_id } }
            );
            return updatedTeacher;
          })
        );

        // Simpan data ke database
        const newProfileImage = await Setting.update(
          {
            default_profile_image: url,
          },
          { where: { id: currentDefaultImageSettings.id } }
        );

        return res.status(201).json({
          msg: "Successfully Updated Default Profile Image!",
          data: {
            url: url,
          },
        });
      } else {
        return res
          .status(500)
          .json({ message: "Provide Default Image Please!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertDefaultImageBatch: async (req, res) => {
    try {
      if (req.files && Object.keys(req.files).length > 0) {
        const batchImage = req.files.defaultImageBatch;

        const fileSize = batchImage.data.length || batchImage.size;
        const ext = path.extname(batchImage.name);
        const fileName = batchImage.md5 + ext;
        const url = `settings/default-image-batch/${fileName}`; // URL file gambar batch
        const allowedTypes = [".png", ".jpg", ".jpeg"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        // Read the directory and delete any existing image files
        const files = fs.readdirSync("./public/settings/default-image-batch");
        for (const file of files) {
          if (allowedTypes.includes(path.extname(file).toLowerCase())) {
            fs.unlinkSync(
              path.join("./public/settings/default-image-batch/", file)
            );
          }
        }

        if (batchImage) {
          fs.writeFileSync(
            `./public/settings/default-image-batch/${fileName}`,
            batchImage.data
          );
        }

        // Update the default image batch setting in the database
        const currentDefaultImageSettings = await Setting.findOne({
          attributes: ["default_image_batch", "id"],
        });

        // Identify all bacthes with the current default image batch
        const batchesWithDefaultImage = await Batch.findAll({
          where: {
            url: currentDefaultImageSettings.default_image_batch,
          },
        });

        const updatedBatches = await Promise.all(
          batchesWithDefaultImage.map(async (batch) => {
            const updatedBatch = await Batch.update(
              {
                image_batch: fileName,
                url: `settings/default-image-batch/${fileName}`,
              },
              { where: { batch_id: batch.batch_id } }
            );
            return updatedBatch; // Kembalikan hasil pembaruan
          })
        );

        const newBatchImage = await Setting.update(
          {
            default_image_batch: url,
          },
          { where: { id: currentDefaultImageSettings.id } }
        );

        return res.status(201).json({
          msg: "Successfully Updated Default Image Batch!",
          data: {
            url: url,
          },
        });
      } else {
        return res
          .status(500)
          .json({ message: "Provide Default Image Batch Please!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertImageHomeUser: async (req, res) => {
    try {
      if (req.files && Object.keys(req.files).length > 0) {
        const imageHomeUser = req.files.imageHomeUser;

        const fileSize = imageHomeUser.data.length || imageHomeUser.size;
        const ext = path.extname(imageHomeUser.name);
        const fileName = imageHomeUser.md5 + ext;
        const imageUrl = `settings/image-home-user/${fileName}`; // URL file gambar home user
        const allowedTypes = [".png", ".jpg", ".jpeg"];

        if (!allowedTypes.includes(ext.toLowerCase())) {
          return res.status(422).json({ msg: "Invalid Image Type" });
        }

        if (fileSize > 5000000) {
          return res.status(422).json({ msg: "Image must be less than 5MB" });
        }

        // Read the directory and delete any existing image files
        const files = fs.readdirSync("./public/settings/image-home-user");
        for (const file of files) {
          if (allowedTypes.includes(path.extname(file).toLowerCase())) {
            fs.unlinkSync(
              path.join("./public/settings/image-home-user/", file)
            );
          }
        }

        if (imageHomeUser) {
          fs.writeFileSync(
            `./public/settings/image-home-user/${fileName}`,
            imageHomeUser.data
          );
        }

        // Update the default image home user setting in the database
        const currentSetting = await Setting.findOne({
          where: { id: 1 }, // Ubah 1 dengan id setting yang benar
        });

        if (!currentSetting) {
          return res.status(404).json({ msg: "Setting not found" });
        }

        await currentSetting.update({
          image_home_user: imageUrl,
        });

        return res.status(201).json({
          msg: "Successfully Updated Default Image Batch!",
          data: {
            url: imageUrl,
          },
        });
      } else {
        return res
          .status(500)
          .json({ message: "Provide Home User Image Please!" });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  },

  insertLinkDriveCV: async (req, res) => {
    try {
      const { linkDriveCV } = req.body;

      try {
        // Temukan setting yang sudah ada
        let currentSetting = await Setting.findOne({ where: { id: 1 } });

        if (currentSetting) {
          // Update link Google Drive CV dengan yang baru
          await currentSetting.update({ link_drive_cv: linkDriveCV });

          return res.status(200).json({
            msg: "Successfully Updated Google Drive CV Link!",
            data: {
              link_drive_cv: linkDriveCV,
            },
          });
        } else {
          return res.status(404).json({ message: "Setting not found." });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  insertLinkDriveCerti: async (req, res) => {
    try {
      const { linkDriveCerti } = req.body;

      try {
        // Temukan setting yang sudah ada
        let currentSetting = await Setting.findOne({ where: { id: 1 } });

        if (currentSetting) {
          // Update link Google Drive sertifikat dengan yang baru
          await currentSetting.update({ link_drive_certi: linkDriveCerti });

          return res.status(200).json({
            msg: "Successfully Updated Google Drive Certificate Link!",
            data: {
              link_drive_certi: linkDriveCerti,
            },
          });
        } else {
          return res.status(404).json({ message: "Setting not found." });
        }
      } catch (error) {
        return res
          .status(500)
          .json({ message: "Internal Server Error", error: error.message });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Internal Server Error", error: error.message });
    }
  },

  insertLogoAdmin: async (req, res) => {
    try {
      // Pastikan properti req.files.adminLogo ada dan memiliki data
      if (!req.files || !req.files.adminLogo) {
        return res.status(422).json({ msg: "Admin Logo Image is required" });
      }

      const adminLogo = req.files.adminLogo;
      const fileSize = adminLogo.size;
      const ext = path.extname(adminLogo.name);
      const fileName = adminLogo.md5 + ext;
      const url = `settings/admin-logo/${fileName}`; // URL file gambar logo admin
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      // Cek tipe file yang diizinkan
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      // Cek ukuran file
      if (fileSize > 5 * 1024 * 1024) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
      }

      // Simpan gambar logo admin ke direktori
      const dirPath = "./public/settings/admin-logo";
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Pindahkan gambar baru ke direktori
      await adminLogo.mv(path.join(dirPath, fileName));

      // Perbarui pengaturan logo admin di basis data
      let currentSetting = await Setting.findOne({ where: { id: 1 } });

      if (!currentSetting) {
        // Buat setting baru jika belum ada
        currentSetting = await Setting.create({ image_logo_admin: url });
      } else {
        // Hapus gambar lama jika ada
        const oldImagePath = `./public/${currentSetting.image_logo_admin}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Perbarui URL gambar logo admin jika setting sudah ada
        await currentSetting.update({ image_logo_admin: url });
      }

      return res.status(201).json({
        msg: "Successfully Updated Admin Logo!",
        data: {
          url: url,
        },
      });
    } catch (error) {
      console.error("Error inserting admin logo:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  insertLogoUser: async (req, res) => {
    try {
      // Pastikan properti req.files.userLogo ada dan memiliki data
      if (!req.files || !req.files.userLogo) {
        return res.status(422).json({ msg: "User Logo Image is required" });
      }

      const userLogo = req.files.userLogo;
      const fileSize = userLogo.size;
      const ext = path.extname(userLogo.name);
      const fileName = userLogo.md5 + ext;
      const url = `settings/user-logo/${fileName}`; // URL file gambar logo user
      const allowedTypes = [".png", ".jpg", ".jpeg"];

      // Cek tipe file yang diizinkan
      if (!allowedTypes.includes(ext.toLowerCase())) {
        return res.status(422).json({ msg: "Invalid Image Type" });
      }

      // Cek ukuran file
      if (fileSize > 5 * 1024 * 1024) {
        return res.status(422).json({ msg: "Image must be less than 5MB" });
      }

      // Simpan gambar logo user ke direktori
      const dirPath = "./public/settings/user-logo";
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Pindahkan gambar baru ke direktori
      await userLogo.mv(path.join(dirPath, fileName));

      // Perbarui pengaturan logo user di basis data
      let currentSetting = await Setting.findOne({ where: { id: 1 } });

      if (!currentSetting) {
        // Buat setting baru jika belum ada
        currentSetting = await Setting.create({ image_logo_user: url });
      } else {
        // Hapus gambar lama jika ada
        const oldImagePath = `./public/${currentSetting.image_logo_user}`;
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }

        // Perbarui URL gambar logo user jika setting sudah ada
        await currentSetting.update({ image_logo_user: url });
      }

      return res.status(201).json({
        msg: "Successfully Updated User Logo!",
        data: {
          url: url,
        },
      });
    } catch (error) {
      console.error("Error inserting user logo:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  insertDefaultPassword: async (req, res) => {
    try {
      const { defaultPassword } = req.body;

      // Validasi panjang minimal dan maksimal password
      if (defaultPassword.length < 8 || defaultPassword.length > 16) {
        return res.status(422).json({
          msg: "Password length must be between 8 and 16 characters",
        });
      }

      // Cek apakah sudah ada setting default password
      let currentSetting = await Setting.findOne({ where: { id: 1 } });

      if (currentSetting) {
        // Jika sudah ada, update default password-nya
        await currentSetting.update({ default_password: defaultPassword });
      } else {
        // Jika belum ada, buat setting baru
        currentSetting = await Setting.create({
          default_password: defaultPassword,
        });
      }

      return res.status(201).json({
        msg: "Default Password Set Successfully",
        data: {
          defaultPassword: defaultPassword,
        },
      });
    } catch (error) {
      console.error("Error setting default password:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = SettingController;
