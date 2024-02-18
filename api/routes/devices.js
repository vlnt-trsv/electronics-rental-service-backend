const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");
const DevicesController = require("../controllers/devices");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

// Получение списка всех продуктов
router.get("/", checkAuth, DevicesController.devices_get_all);

// Создание нового продукта
router.post(
  "/",
  checkAuth,
  upload.single("deviceImage"),
  DevicesController.devices_create_device
);

// Получение детальной информации о конкретном продукте
router.get("/:deviceId", checkAuth, DevicesController.devices_get_device);

// Обновление продукта
router.patch("/:deviceId", checkAuth, DevicesController.devices_update_device);

// Удаление продукта
router.delete("/:deviceId", checkAuth, DevicesController.devices_delete_device);

module.exports = router;
