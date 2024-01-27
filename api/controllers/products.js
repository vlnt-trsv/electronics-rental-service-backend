const Product = require("../models/product");
const mongoose = require("mongoose");

// Получение списка всех продуктов
exports.products_get_all = (req, res, next) => {
  Product.find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            _id: doc._id,
            productImage: doc.productImage,
            request: {
              type: "GET",
              url: "http://localhost:5000/products/" + doc._id,
            },
          };
        }),
      };
      //   if (docs.lenght >= 0) {
      res.status(200).json(response);
      //   } else {
      //     res.status(404).json({
      //       message: "No entries found",
      //     });
      //   }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

// Создание нового продукта
exports.products_create_product = (req, res, next) => {
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Created product successfully",
        createdProduct: {
          _id: result._id,
          name: result.name,
          price: result.price,
          request: {
            type: "POST",
            url: "http://localhost:5000/products/" + result._id,
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
exports.products_get_product = (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From DB:", doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            url: "http://localhost:5000/products",
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

// Обновление продукта
exports.products_update_product = (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: "Product updated successfully",
          request: {
            type: "GET",
            url: "http://localhost:5000/products/" + id,
          },
        });
      } else {
        res.status(404).json({
          message: "Product not found",
          request: {
            type: "GET",
            url: "http://localhost:5000/products/" + id,
          },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.products_delete_product = (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      if (result.deletedCount === 1) {
        res.status(200).json({
          message: "Product deleted successfully",
          request: {
            type: "POST",
            url: "http://localhost:5000/products/" + id,
            body: { name: "String", price: "Number" },
          },
        });
      } else {
        res.status(404).json({
          message: "Product not found",
          request: {
            type: "POST",
            url: "http://localhost:5000/products/" + id,
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
