require("dotenv").config();

const User = require("../models/user");
const VerificationCode = require("../models/verificationCode");
const mailer = require("../nodemailer");
const mongoose = require("mongoose");

// Функция для генерации кода
function generateCode() {
  return Math.floor(1000 + Math.random() * 9000); // Генерация четырехзначного кода
}

const handleLogin = async (req, res) => {
  const userEmail = req.body.email;

  if (!userEmail) {
    return res.status(400).json({
      message: "Email address is required",
    });
  }

  try {
    let user = await User.findOne({ email: userEmail }).exec();
    if (!user) {
      user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: userEmail,
      });
      await user.save();
    }

    const code = generateCode();
    const message = {
      to: userEmail,
      subject: "Подтверждение входа",
      text: `Ваш код подтверждения: ${code}\nКод подтверждения будет действовать в течение 2 минут`,
    };

    mailer(message);

    const verificationCode = new VerificationCode({
      userId: user._id,
      code: code,
    });

    await verificationCode.save();

    res.status(200).json({
      message: "Код подтверждения отправлен на ваш email",
      code: verificationCode, // TODO: Удалить после тестирования
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({
      message: "Failed to perform login and send verification code",
    });
  }
};

const verifyCode = async (req, res) => {
  const enteredCode = req.body.code;
  const userEmail = req.body.email;

  if (!enteredCode || !userEmail) {
    return res.status(400).json({
      message: "Код и email обязательны для проверки",
    });
  }

  try {
    const user = await User.findOne({ email: userEmail }).exec();

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }

    // Check if the entered code matches the one in the database
    const verificationCode = await VerificationCode.findOne({
      userId: user._id,
      code: enteredCode,
    }).exec();

    if (!verificationCode) {
      return res.status(401).json({
        message: "Неверный код подтверждения",
      });
    }

    // Save the user's information to the session
    req.session.user = user;
    req.session.authorized = true;

    // Set a cookie with the user's information
    res.cookie("connect.user", JSON.stringify(user), {
      httpOnly: false, // Set to false if you want to access the cookie from client-side JavaScript
      secure: false, // Set to true if you're using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    // Remove the verification code from the database
    await VerificationCode.deleteOne({ _id: verificationCode._id });

    res.status(200).json({
      message: "Авторизация прошла успешно",
      user: user,
    });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({
      message: "Ошибка при попытке авторизации или отправки кода подтверждения",
    });
  }
};

module.exports = { handleLogin, verifyCode };
