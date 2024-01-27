const express = require("express");
const router = express.Router();
const multer = require("multer");
const checkAuth = require("../middlewares/check-auth");
const ProductsController = require("../controllers/products");

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

const Product = require("../models/product");

// Получение списка всех продуктов
router.get("/", ProductsController.products_get_all);

// Создание нового продукта
router.post("/", checkAuth, upload.single("productImage"), ProductsController.products_create_product);

// Получение детальной информации о конкретном продукте
router.get("/:productId", ProductsController.products_get_product);

// Обновление продукта
router.patch("/:productId", checkAuth, ProductsController.products_update_product);

// Удаление продукта
router.delete("/:productId", checkAuth, ProductsController.products_delete_product);

module.exports = router;
