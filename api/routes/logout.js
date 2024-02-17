const express = require("express");
const router = express.Router();
const LogoutController = require("../controllers/logout");
const checkAuth = require("../middlewares/check-auth");

// Маршрут для выхода
router.post("/", checkAuth, LogoutController.handleLogout);

module.exports = router;
