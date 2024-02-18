const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");

const RentalsController = require("../controllers/rentals");

// Получение списка всех заказов
router.get("/", checkAuth, RentalsController.rentals_get_all);

// Создание нового заказа
router.post("/", checkAuth, RentalsController.rentals_create_rental);

// Получение детальной информации о конкретном заказе
router.get("/:rentalId", checkAuth, RentalsController.rentals_get_rental);

// Обновление заказа
router.patch("/:rentalId", checkAuth, RentalsController.rentals_update_rental);

// Удаление заказа
router.delete("/:rentalId", checkAuth, RentalsController.rentals_delete_rental);

module.exports = router;
