const mongoose = require("mongoose");
const Device = require("../models/device");

// Получение списка всех продуктов
exports.devices_get_all = (req, res, next) => {
  Device.find()
    .select("name price _id deviceImage categoryId subscriptionOptions")
    .populate("categoryId", "name")
    .exec()
    .then((docs) => {
      if (docs.length > 0) {
        const response = {
          count: docs.length,
          devices: docs.map((doc) => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              deviceImage: doc.deviceImage,
              category: doc.categoryId,
              subscriptionOptions: doc.subscriptionOptions,
              request: {
                type: "GET",
                url: "http://localhost:5000/api/v1/devices/" + doc._id,
              },
            };
          }),
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Записей не найдено",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Создание нового продукта
exports.devices_create_device = (req, res, next) => {
  const { name, price, categoryId, subscriptionOptions } = req.body;

  const device = new Device({
    _id: new mongoose.Types.ObjectId(),
    name,
    price,
    deviceImage: req.file.path,
    categoryId,
    subscriptionOptions,
  });
  device
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created device successfully",
        createdDevice: {
          _id: result._id,
          name: result.name,
          price: result.price,
          deviceImage: result.deviceImage,
          category: result.categoryId,
          subscriptionOptions: result.subscriptionOptions,
          request: {
            type: "POST",
            url: "http://localhost:5000/api/v1/devices/" + result._id,
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Получение детальной информации о конкретном продукте
exports.devices_get_device = (req, res, next) => {
  const id = req.params.deviceId;
  Device.findById(id)
    .select("name price _id deviceImage categoryId subscriptionOptions")
    .populate("categoryId", "name")
    .exec()
    .then((doc) => {
      console.log("From DB:", doc);
      if (doc) {
        res.status(200).json({
          device: doc,
          request: {
            type: "GET",
            url: "http://localhost:5000/api/v1/devices",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Получение продуктов по id категории
exports.devices_get_device_by_categoryId = (req, res, next) => {
  const categoryId = req.params.categoryId;

  Device.find({ categoryId })
    .select("name price _id deviceImage categoryId subscriptionOptions")
    .exec()
    .then((devices) => {
      if (devices && devices.length > 0) {
        res.status(200).json({
          devices,
          request: {
            type: "GET",
            url: "http://localhost:5000/api/v1/devices",
          },
        });
      } else {
        res
          .status(404)
          .json({ message: "No devices found for provided category ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Обновление продукта
exports.devices_update_device = (req, res, next) => {
  const id = req.params.deviceId;
  const updateOps = req.body;

  Device.findByIdAndUpdate(id, { $set: updateOps }, { new: true })
    .exec()
    .then((updatedDevice) => {
      if (updatedDevice) {
        res.status(200).json({
          message: "Device updated successfully",
          device: updatedDevice,
          request: {
            type: "GET",
            url: "http://localhost:5000/api/v1/devices/" + id,
          },
        });
      } else {
        res.status(404).json({
          message: "Device not found",
          request: {
            type: "GET",
            url: "http://localhost:5000/api/v1/devices/" + id,
          },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.devices_delete_device = (req, res, next) => {
  const id = req.params.deviceId;
  Device.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).json({
          message: "Device deleted successfully",
          request: {
            type: "POST",
            url: "http://localhost:5000/api/v1/devices/" + id,
            body: { name: "String", price: "Number" },
          },
        });
      } else {
        res.status(404).json({
          message: "Device not found",
          request: {
            type: "POST",
            url: "http://localhost:5000/api/v1/devices/" + id,
            body: { name: "String", price: "Number" },
          },
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err });
    });
};
