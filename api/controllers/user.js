require("dotenv").config();
const User = require("../models/user");

// Получение списка всех пользователей
exports.user_get_all = (req, res, next) => {
  User.find()
    .select("email _id")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        users: docs.map((doc) => {
          return {
            _id: doc._id,
            email: doc.email,
            nickname: doc.nickname,
            request: {
              type: "GET",
              url: "http://localhost:5000/api/v1/user/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Получение определённого пользователя
exports.user_get_user = (req, res, next) => {
  User.findById(req.params.userId)
    .exec()
    .then((user) => {
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userData = {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        patronymic: user.patronymic,
        phone: user.phone,
        consentToPrivacyPolicy: user.consentToPrivacyPolicy,
        consentToDataProcessing: user.consentToDataProcessing,
        consentToReceiveNotifications: user.consentToReceiveNotifications,
        verificationCode: user.verificationCode,
      };

      res.status(200).json({
        user: userData,
        request: {
          type: "GET",
          url: "http://localhost:5000/api/v1/user",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Обновление данных пользователя
exports.user_update = async (req, res) => {
  const userId = req.params.userId;
  console.log("Updating user with ID:", userId);
  console.log("Request body:", req.body);

  try {
    const existingUser = await User.findById(userId);
    console.log("Existing user:", existingUser);

    if (!existingUser) {
      console.log("User not found");
      return res.status(404).json({ error: "User not found" });
    }

    Object.keys(req.body).forEach((field) => {
      existingUser[field] = req.body[field];
    });

    try {
      const updatedUser = await existingUser.save();
      console.log("User updated successfully:", updatedUser);
      res.status(200).json({ message: "User data updated successfully" });
    } catch (error) {
      console.error("Error saving updated user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Удаление пользователя
exports.user_delete = (req, res, next) => {
  User.deleteOne({ _id: req.params.userId })
    .exec()
    .then((result) => {
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      res.status(200).json({
        message: "Пользователь успешно удален",
        deletedUserId: req.params.userId,
      });
    })
    .catch((err) => {
      console.error("Error occurred while deleting user:", err);
      res.status(500).json({ error: "Internal server error" });
    });
};
