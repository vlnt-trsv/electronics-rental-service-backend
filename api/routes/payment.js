const express = require("express");
const router = express.Router();
const Payment = require("../models/payment");
const checkAuth = require("../middlewares/check-auth");

// Получение всех платежей
router.get("/", checkAuth, async (req, res) => {
  const userId = req.params.userId;
  try {
    const payments = await Payment.find(userId)
      .populate("rental")
      .populate("user");
    res.status(200).json({ payments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Получение платежа по идентификатору
router.get("/", checkAuth, async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId).populate(
      "rental"
    );
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({
      message: "Payment",
      payment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// // Создание нового платежа
// router.post('/',checkAuth, async (req, res) => {
//   try {
//     const newPayment = new Payment(req.body);
//     const savedPayment = await newPayment.save();
//     res.status(201).json(savedPayment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Обновление платежа по идентификатору
// router.put('/:paymentId', checkAuth, async (req, res) => {
//   try {
//     const updatedPayment = await Payment.findByIdAndUpdate(req.params.paymentId, req.body, { new: true });
//     if (!updatedPayment) {
//       return res.status(404).json({ message: 'Payment not found' });
//     }
//     res.status(200).json(updatedPayment);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// Удаление платежа по идентификатору
router.delete("/:paymentId", checkAuth, async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndRemove(
      req.params.paymentId
    );
    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
