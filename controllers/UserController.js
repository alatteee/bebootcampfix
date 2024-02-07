const User = require("../models/User.js");

const UserController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: ["nama", "email", "role"],
      });

      return res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get a user by ID
  getUserById: async (req, res) => {
    const id = req.params.id;

    try {
      const user = await User.findByPk(id, {
        attributes: ["nama", "email", "role"],
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(user);
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = UserController;
