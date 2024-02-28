const mongoose = require("mongoose");

const Rental = require("../models/rental");
const Device = require("../models/device");
const User = require("../models/user");
const Payment = require("../models/payment");

const { processPayment } = require("../service/paymentService");

// Получение списка всех заказов
exports.rentals_get_all = (req, res, next) => {
  const status = req.query.status;
  const userId = req.query.userId;
  let filter = { user: userId };

  // Если статус указан, добавляем фильтр
  if (status) {
    filter.status = status;
  }

  Rental.find(filter)
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        rentals: docs.map((doc) => {
          return {
            _id: doc._id,
            userId: doc.user,
            device: doc.device,
            category: doc.category,
            subscriptionOptions: doc.subscriptionOptions,
            deliveryMethod: doc.deliveryMethod,
            deliveryCost: doc.deliveryCost,
            status: doc.status,
            rentalDate: doc.rentalDate,
            startDate: doc.startDate,
            endDate: doc.endDate,
            request: {
              type: "GET",
              url: "http://localhost:8000/api/v1/rentals/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Создание нового заказа
exports.rentals_create_rental = async (req, res, next) => {
  try {
    const { deviceId, subscriptionOptionsId, userId, deliveryMethod } =
      req.body;

    // Найти устройство по идентификатору
    const device = await Device.findById(deviceId).populate("categoryId");
    if (!device) {
      return res.status(404).json({ message: "Device not found" });
    }

    // Найти выбранную опцию аренды
    const selectedOption = device.subscriptionOptions.find(
      (option) => option._id.toString() === subscriptionOptionsId
    );
    if (!selectedOption) {
      return res.status(400).json({ message: "Invalid subscription option" });
    }

    // Получить пользователя по userId
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Создать новую аренду
    const rental = new Rental({
      _id: new mongoose.Types.ObjectId(),
      user: user._id,
      rentalDate: new Date(),
      device: {
        _id: device._id,
        name: device.name,
        deviceImage: device.deviceImage,
      },
      category: {
        _id: device.categoryId._id,
        name: device.categoryId.name,
      },
      subscriptionOptions: {
        _id: selectedOption._id,
        duration: selectedOption.duration,
        price: selectedOption.price,
      },
      deliveryMethod: deliveryMethod,
      status: "Не оплачено",
    });

    // Сохранить аренду в базе данных
    const result = await rental.save();
    res.status(201).json({
      message: "Rental created successfully",
      createdRental: result,
      request: {
        type: "GET",
        url: "http://localhost:8000/api/v1/rentals/" + rental._id,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Оплата аренды
exports.rentals_pay_rental = async (req, res, next) => {
  try {
    const rentalId = req.params.rentalId;
    const { paymentDetails } = req.body; // Предполагается, что платежные реквизиты будут отправлены в теле запроса

    // Поиск аренды по идентификатору
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Определение стоимости доставки
    const deliveryCost = 240;

    // Обработка платежа
    const paymentResult = await processPayment(paymentDetails);

    if (!paymentResult.success) {
      // Если платеж не прошел, обновляем статус аренды и сохраняем аренду
      rental.status = "Ошибка оплаты";
      await rental.save();

      return res
        .status(400)
        .json({ message: "Payment failed", error: paymentResult.error });
    }

    // Если платеж прошел успешно, создаем новый платеж в базе данных
    const totalAmount = rental.subscriptionOptions.price + deliveryCost;

    // Если платеж прошел успешно, создаем новый платеж в базе данных
    const payment = new Payment({
      user: rental.user._id,
      rental: rentalId,
      amount: totalAmount, // Предполагается, что цена аренды хранится в аренде
      status: "Оплачено",
    });

    // Сохраняем платеж в базе данных
    await payment.save();

    // Обновление статуса аренды до "Оплачено".
    rental.status = "Оплачено";
    rental.startDate = new Date(); // Установка даты начала аренды
    rental.endDate = new Date(
      Date.now() + rental.subscriptionOptions.duration * 24 * 60 * 60 * 1000
    ); // Установка даты окончания аренды
    await rental.save();

    res.status(200).json({
      message: "Payment successful",
      rental: rental,
      payment: payment,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Изменение статуса аренды на "В аренде"
// Назначает администратор
exports.rentals_start_rental = async (req, res) => {
  try {
    const rentalId = req.params.rentalId;

    // Найти аренду по идентификатору
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Проверяем, оплачена ли аренда
    if (rental.status !== "Оплачено") {
      return res
        .status(400)
        .json({ message: "Аренда не оплачена, старт невозможен" });
    }

    // Ставим аренду в статус "В аренде"
    rental.status = "В аренде";
    await rental.save();

    res.status(200).json({
      message: "Аренда успешно начата",
      rental: rental,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Произошла ошибка при старте аренды", error });
  }
};

// Отмена аренды
exports.rentals_cancel_rental = async (req, res) => {
  try {
    const rentalId = req.params.rentalId;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Проверяем, можно ли отменить аренду
    if (new Date(rental.startDate) > new Date()) {
      return res
        .status(400)
        .json({ message: "Невозможно отменить аренду после даты начала" });
    }

    // Проверяем, можно ли отменить аренду
    if (rental.status === "Оплачено") {
      return res
        .status(400)
        .json({ message: "Невозможно отменить оплаченную аренду" });
    }

    // Отменяем аренду
    rental.status = "Отменено";
    await rental.save();

    res.status(200).json({
      message: "Аренда успешно отменена",
      rental: rental,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Завершение аренды
exports.rentals_complete_rental = async (req, res) => {
  try {
    const rentalId = req.params.rentalId;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // // Проверяем, закончилась ли аренда
    // if (new Date() < new Date(rental.endDate)) {
    //   return res.status(400).json({ message: "Аренда еще не закончилась" });
    // }

    // // Вычисляем startDate как endDate минус продолжительность аренды
    // const durationInMilliseconds = rental.subscriptionOptions.duration * 24 * 60 * 60 * 1000;
    // const startDate = new Date(rental.endDate.getTime() - durationInMilliseconds);

    // Завершаем аренду
    rental.status = "Завершено";
    startDate = rental.startDate;
    endDate = rental.endDate;
    await rental.save();

    res.status(200).json({
      message: "Аренда успешно завершена",
      rental: rental,
    });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Получение детальной информации о конкретном заказе
exports.rentals_get_rental = (req, res, next) => {
  Rental.findById(req.params.rentalId)
    .populate("device")
    .exec()
    .then((rental) => {
      if (!rental) {
        return res.status(404).json({
          message: "Rental not found",
        });
      }
      res.status(200).json({
        rental: rental,
        request: {
          type: "GET",
          url: "http://localhost:5000/api/v1/rentals",
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Обновление заказа
exports.rentals_update_rental = (req, res, next) => {
  const id = req.params.rentalId;
  const updateOps = req.body;

  Rental.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
    .exec()
    .then((updatedRental) => {
      if (updatedRental) {
        res.status(200).json({
          message: "Rental updated successfully",
          rental: updatedRental,
          request: {
            type: "GET",
            url: "http://localhost:5000/api/v1/rentals/" + id,
          },
        });
      } else {
        res.status(404).json({ message: "Rentals not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Удаление заказа
exports.rentals_delete_rental = (req, res, next) => {
  Rental.deleteOne({ _id: req.params.rentalId })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Rental deleted",
        request: {
          type: "POST",
          url: "http://localhost:5000/api/v1/rentals",
          body: {
            deviceId: "String",
            subscriptionOptionsId: "String",
            userId: "String",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
