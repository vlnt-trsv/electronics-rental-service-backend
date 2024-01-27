const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/check-auth");

const OrdersController = require("../controllers/orders");

// Получение списка всех заказов
router.get("/", checkAuth, OrdersController.orders_get_all);

// Создание нового заказа
router.post("/", checkAuth, OrdersController.orders_create_order);

// Получение детальной информации о конкретном заказе
router.get("/:orderId", checkAuth, OrdersController.orders_get_order);

// Обновление заказа
// router.patch("/:orderId", checkAuth, OrdersController.orders_update_order);

// Удаление заказа
router.delete("/:orderId", checkAuth, OrdersController.orders_delete_order);

module.exports = router;
