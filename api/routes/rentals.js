const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");

const RentalsController = require("../controllers/rentals");

// Получение списка всех заказов
router.get("/", checkAuth, RentalsController.rentals_get_all);

// Создание нового заказа
router.post("/create", checkAuth, RentalsController.rentals_create_rental);

// Оплата аренды
router.post("/:rentalId/pay", checkAuth, RentalsController.rentals_pay_rental);

// Изменение статуса аренды на "В аренде" 
// ТОЛЬКО ДЛЯ ЕСЛИ ПОЛЬЗОВАТЕЛЬ ПОЛУЧИЛ ДЕВАЙС ИЗ ПУНКТА ВЫДАЧА
// Назначает администратор 
router.post("/:rentalId/start", checkAuth, RentalsController.rentals_start_rental);

// Отмена аренды
router.post("/:rentalId/cancel", checkAuth, RentalsController.rentals_cancel_rental);

// Завершение аренды
router.post("/:rentalId/complete", checkAuth, RentalsController.rentals_complete_rental);

// Получение детальной информации о конкретном заказе
router.get("/:rentalId", checkAuth, RentalsController.rentals_get_rental);

// Обновление заказа
router.patch("/:rentalId", checkAuth, RentalsController.rentals_update_rental);

// Удаление заказа
router.delete("/:rentalId", checkAuth, RentalsController.rentals_delete_rental);

module.exports = router;
