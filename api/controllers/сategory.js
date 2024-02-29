const Category = require("../models/сategory");
const Device = require("../models/device");

const CategoryController = {
  // Получение всех категорий
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.find().lean();
      const categoriesWithDeviceCount = await Promise.all(
        categories.map(async (category) => {
          const deviceCount = await Device.countDocuments({
            categoryId: category._id,
          });
          return { ...category, deviceCount };
        })
      );
      res.json(categoriesWithDeviceCount);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Создание новой категории
  createCategory: async (req, res) => {
    const category = new Category({
      name: req.body.name,
    });
    try {
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Получение одной категории по ID
  getCategoryById: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Обновление категории
  updateCategory: async (req, res) => {
    try {
      const category = await Category.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Удаление категории
  deleteCategory: async (req, res) => {
    try {
      await Category.findByIdAndDelete(req.params.id);
      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = CategoryController;
