module.exports = (req, res, next) => {
  if (req.session.authorized) {
    // Удаляем ошибку, если она была установлена ранее
    delete req.session.error;

    // Устанавливаем сообщение об успешном доступе
    req.session.success = "Доступ разрешён";
    next();
  } else {
    // Проверяем наличие предыдущей ошибки и удаляем ее
    if (req.session.error) {
      delete req.session.error;
    }

    // Устанавливаем сообщение об ошибке
    req.session.error = "Сперва, вы должны войти в систему";
    res.redirect("/api/v1/login");
  }
};