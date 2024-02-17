const User = require("../models/user");
const jwt = require("jsonwebtoken");

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Нет токена

  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log("Payload:", payload);
    const foundUser = await User.findById(payload._id).exec();

    // Проверка наличия refreshToken у пользователя
    if (!foundUser || !foundUser.refreshToken.includes(refreshToken)) {
      return res.sendStatus(403); // Forbidden
    }

    // Создание новых токенов
    const newAccessToken = jwt.sign(
      { _id: foundUser._id, email: foundUser.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30m" }
    );

    const newRefreshToken = jwt.sign(
      { _id: foundUser._id, email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Обновление refreshToken в базе данных
    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rt) => rt !== refreshToken
    );
    foundUser.refreshToken.push(newRefreshToken);
    await foundUser.save();

    // Установка нового refresh токена в cookies
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error occurred while verifying refresh token:", error);
    return res.sendStatus(403); // Forbidden
  }
};

module.exports = { handleRefreshToken };
