const userService = require("../service/user-service");

class UserController {
  async registration(req, res, next) {
    try {
      const { phone } = req.body;
      const userData = await userService.registration(phone);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      console.error("Ошибка при регистрации:", e);
      res.status(500).json({ error: "Internal Server Error (user-contr.)" });
    }
  }

  async login(req, res, next) {
    try {
      const { phone } = req.body;
      const userData = await userService.login(phone);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });
      return res.json(userData);
    } catch (e) {
      console.error("Ошибка при регистрации:", e);
      res.status(500).json({ error: "Internal Server Error (user-contr.)" });
    }
  }

  async logout(req, res, next) {
    try {
      
    } catch (e) {}
  }

  async activate(req, res, next) {
    try {
    } catch (e) {}
  }

  async refresh(req, res, next) {
    try {
    } catch (e) {}
  }

  async getUsers(req, res, next) {
    try {
      res.json(["123", "456"]);
    } catch (e) {}
  }
}

module.exports = new UserController();
