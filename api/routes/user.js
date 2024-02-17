const express = require("express");
const router = express.Router();
const UserController = require("../controllers/user");
const LogoutController = require("../controllers/logout");
const checkAuth = require("../middlewares/check-auth");

// Маршруты для пользователей
router.get("/", UserController.user_get_all);
router.get("/:userId", UserController.user_get_user);
router.patch("/update/:userId", checkAuth, UserController.user_update);
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
