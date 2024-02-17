const User = require("../models/user");

const handleLogout = async (req, res) => {
  // На клиенте также следует удалить accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content, нет токена
  const refreshToken = cookies.jwt;

  // Проверяем, находится ли refreshToken в базе данных
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    // Очистка cookie, если токен не найден в базе данных
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204); // No content
  }

  // Удаление refreshToken из базы данных
  foundUser.refreshToken = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );
  const result = await foundUser.save();
  console.log(result);

  // Очистка cookie после удаления токена из базы данных
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.status(200).json({
    message: "Успешный выход из системы!",
  });
};

module.exports = { handleLogout };
