const mongoose = require("mongoose");

const Rental = require("../models/rental");
const Device = require("../models/device");
const User = require("../models/user");

// Получение списка всех заказов
exports.rentals_get_all = (req, res, next) => {
  Rental.find()
    // .select("device category subscriptionOptions status")
    // .populate("device", "_id name deviceImage")
    // .populate("category", "_id name")
    // .populate("subscriptionOptions")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        rentals: docs.map((doc) => {
          return {
            _id: doc._id,
            device: doc.device,
            category: doc.category,
            subscriptionOptions: doc.subscriptionOptions,
            status: doc.status,
            startDate: doc.startDate,
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
    const { deviceId, subscriptionOptionsId, userId } = req.body;

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
      user: user._id,
      status: "Не оплачено",
      startDate: new Date(),
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

// Отмена аренды
exports.rentals_cancel_rental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Проверяем, можно ли отменить аренду
    if (new Date(rental.startDate) < new Date()) {
      return res
        .status(400)
        .json({ message: "Cannot cancel rental after start date" });
    }

    // Отменяем аренду
    rental.status = "cancelled";
    await rental.save();

    res.json(rental);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};

// Завершение аренды
exports.rentals_complete_rental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    const rental = await Rental.findById(rentalId);

    if (!rental) {
      return res.status(404).json({ message: "Rental not found" });
    }

    // Проверяем, закончилась ли аренда
    if (new Date() < new Date(rental.endDate)) {
      return res.status(400).json({ message: "Rental has not ended" });
    }

    // Завершаем аренду
    rental.status = "completed";
    await rental.save();

    res.json(rental);
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
            deviceId: "ID",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
