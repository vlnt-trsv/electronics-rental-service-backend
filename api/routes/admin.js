// const express = require("express");
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcrypt");
// const router = express.Router();

// // Замените этот объект пользователей на базу данных
// const users = [
//   {
//     id: 1,
//     username: "admin",
//     password: "123",
//   },
// ];

// // Сериализация и десериализация пользователя
// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   const user = users.find((user) => user.id === id);
//   done(null, user);
// });

// // Настройка стратегии аутентификации
// passport.use(
//   new LocalStrategy((username, password, done) => {
//     const user = users.find((user) => user.username === username);

//     if (!user) {
//       return done(null, false, { message: "Неверное имя пользователя." });
//     }

//     if (!bcrypt.compareSync(password, user.password)) {
//       return done(null, false, { message: "Неверный пароль." });
//     }

//     return done(null, user);
//   })
// );

// // Роут для входа
// router.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/admin",
//     failureRedirect: "/login",
//     failureFlash: true,
//   })
// );

// // Роут для выхода
// router.get("/logout", (req, res) => {
//   req.logout();
//   res.redirect("/login");
// });

// // Защита маршрута админ-панели
// function isAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect("/login");
// }

// // Роут для админ-панели (защищенный маршрут)
// router.get("/", isAuthenticated, (req, res) => {
//   const successMessage = req.flash("success"); // Получите сообщения flash
//   res.send(`Вы вошли в админ-панель. ${successMessage}`);
// });

// module.exports = router;
