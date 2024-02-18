const mongoose = require("mongoose");

const Rental = require("../models/rental");
const Device = require("../models/device");

// Получение списка всех заказов
exports.rentals_get_all = (req, res, next) => {
  Rental.find()
    .select("device quantity _id")
    .populate("device", "name")
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        rentals: docs.map((doc) => {
          return {
            _id: doc._id,
            device: doc.device,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:5000/api/v1/rentals/" + doc._id,
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
exports.rentals_create_rental = (req, res, next) => {
  Device.findById(req.body.deviceId)
    .then((device) => {
      if (!device) {
        return res.status(404).json({
          message: "Device not found",
        });
      }
      const rental = new Rental({
        _id: new mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        device: req.body.deviceId,
      });
      return rental.save().then((result) => {
        // Возвращаем результат и устройство (device), чтобы получить доступ к цене
        return { rental: result, device: device };
      });
    })
    .then(({ rental, device }) => {
      console.log(rental);
      res.status(201).json({
        message: "Rentals stored",
        createdRentals: {
          _id: rental._id,
          device: rental.device,
          quantity: rental.quantity,
          price: device.price,
        },
        request: {
          type: "GET",
          url: "http://localhost:5000/api/v1/rentals/" + rental._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      if (!res.headersSent) {
        // Проверка, был ли уже отправлен ответ
        res.status(500).json({ error: err });
      }
    });
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
            quantity: "Number",
          },
        },
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
