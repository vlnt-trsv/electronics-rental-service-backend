const express = require("express");
const router = express.Router();

// Маршрут для выхода
router.get("/", (req, res) => {
  console.log(res.cookie("connect.user"));
  try {
    if (!req.session.user) {
      // Проверяем наличие информации о пользователе в сессии
      return res.status(401).json({ error: "Пользователь не авторизован!" });
    } else {
      req.session.destroy();
      res.status(200).json({ message: "Пользователь успешно вышел" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
