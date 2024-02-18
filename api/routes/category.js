const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/сategory");
const checkAuth = require("../middlewares/check-auth");

// Получение всех категорий
router.get("/", checkAuth, CategoryController.getAllCategories);

// Создание новой категории
router.post("/", checkAuth, CategoryController.createCategory);

// Получение одной категории по ID
router.get("/:id", checkAuth, CategoryController.getCategoryById);

// Обновление категории
router.put("/:id", checkAuth, CategoryController.updateCategory);

// Удаление категории
router.delete("/:id", checkAuth, CategoryController.deleteCategory);

module.exports = router;
