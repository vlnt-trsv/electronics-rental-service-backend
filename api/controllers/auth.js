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
      code: verificationCode, // Удалить позже
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
      message: "Code and email address are required",
    });
  }

  try {
    const user = await User.findOne({ email: userEmail }).exec();

    if (!user) {
      return res.status(404).json({
        message: "Пользователь не найден",
      });
    }
    if (user) {
      req.session.user = user;
      req.session.authorized = true;
    }

    const storedCodeRecord = await VerificationCode.findOne({
      userId: user._id,
      code: enteredCode,
    }).exec();

    if (!storedCodeRecord) {
      return res.status(401).json({
        message:
          "Неправильный код подтверждения или код не найден в базе данных",
      });
    }

    await VerificationCode.deleteOne({ _id: storedCodeRecord._id });

    // // Установка данных пользователя в сессию
    // req.session.user = {
    //   _id: user._id,
    //   email: user.email,
    // };
    // req.session.authorized = true

    res.status(200).json({
      message: "Успешный вход в систему!",
      _id: user._id,
      email: user.email,
      sessionId: req.session.id,
      sessionUser: req.session.user,
      sessionAuth: req.session.authorized,
    });
  } catch (error) {
    console.error("Error occurred while verifying code:", error);
    res.status(500).json({
      message: "Failed to verify code",
    });
  }
};

module.exports = { handleLogin, verifyCode };