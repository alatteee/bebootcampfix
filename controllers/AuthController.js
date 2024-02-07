const User = require("../models/User");
const Peserta = require("../models/Peserta");
const Pengajar = require("../models/Pengajar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Batch = require("../models/Batch");

const AuthController = {
  Login: async (req, res) => {
    try {
      const user = await User.findOne({
        where: { email: req.body.email },
      });

      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      let match = false;
      let userId, nama, email, role;

      if (user.role === "user") {
        const peserta = await Peserta.findOne({
          where: { email: req.body.email },
          include: [
            {
              model: Batch, // Ganti Batch dengan nama model atau tabel yang berisi informasi batch
              attributes: ["kategori_batch"],
            },
          ],
        });

        if (!peserta) {
          return res.status(404).json({ msg: "Data peserta tidak ditemukan" });
        }

        match = await bcrypt.compare(
          req.body.password,
          peserta.password_peserta
        );

        userId = peserta.peserta_id;
        nama = peserta.nama_peserta;
        email = peserta.email;
        role = user.role;
      } else if (user.role === "admin") {
        const pengajar = await Pengajar.findOne({
          where: { email_pengajar: req.body.email },
        });

        if (!pengajar) {
          return res.status(404).json({ msg: "Data pengajar tidak ditemukan" });
        }

        match = await bcrypt.compare(
          req.body.password,
          pengajar.password_pengajar
        );

        userId = pengajar.pengajar_id;
        nama = pengajar.nama_pengajar;
        email = pengajar.email_pengajar;
        role = user.role;
      }

      if (match) {
        const accessToken = jwt.sign(
          { userId, nama, email, role },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "1d",
          }
        );

        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return res.json({
          msg: `Login berhasil sebagai ${role}`,
          nama,
          email,
          role,
          accessToken,
        });
      }

      return res.status(401).json({ msg: "Autentikasi gagal" });
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
  },

  Me: async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const userId = decodedToken.userId;

      console.log(userId);

      const user = await User.findOne({
        attributes: ["user_id", "nama", "email", "role"],
        where: { user_id: userId },
      });

      console.log(user);

      if (!user) {
        return res.status(404).json({ msg: "User tidak ditemukan" });
      }

      let userData;

      if (user.role === "user") {
        const peserta = await Peserta.findOne({
          attributes: ["id", "url", "batch_id"],
          where: { peserta_id: userId },
        });

        if (!peserta) {
          return res.status(404).json({ msg: "Data peserta tidak ditemukan" });
        }

        if (peserta) {
          const batchId = peserta.batch_id;

          console.log('batch', batchId);

          if (batchId === undefined || batchId === null) {
            userData = {
              ...user.toJSON(),
              peserta: peserta.toJSON(),
              batch: null,
            };

            return res.status(200).json(userData);
          }

          const batch = await Batch.findOne({
            attributes: ["kategori_batch"],
            where: { batch_id: batchId },
          });

          if (!batch) {
            return res.status(404).json({ msg: "Data batch tidak ditemukan" });
          }

          userData = {
            ...user.toJSON(),
            peserta: peserta.toJSON(),
            batch: batch.toJSON(),
          };
        }

        if (!peserta) {
          return res.status(404).json({ msg: "Data peserta tidak ditemukan" });
        }
      } else if (user.role === "admin") {
        const pengajar = await Pengajar.findOne({
          attributes: ["id", "url"],
          where: { pengajar_id: userId },
        });

        if (!pengajar) {
          return res.status(404).json({ msg: "Data pengajar tidak ditemukan" });
        }

        userData = {
          ...user.toJSON(),
          pengajar: pengajar.toJSON(),
        };
      } else {
        // Handle other roles if necessary
        userData = user.toJSON();
      }

      res.status(200).json(userData);
    } catch (error) {
      console.error("Error during fetching user:", error);
      return res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
  },
};

module.exports = AuthController;
