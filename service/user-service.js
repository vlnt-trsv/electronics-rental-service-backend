const UserModel = require("../models/user-model");
const PhoneService = require("../service/phone-service");
const {
  generateActivationCode,
  sendActivationCode,
} = require("../utils/authentication");

const tokenService = require("../service/token-service");
const UserDto = require("../dtos/user-dto");

const phoneService = new PhoneService();

class UserService {
  async registration(phone) {
    try {
      const candidate = await UserModel.findOne({ phone });

      if (candidate) {
        throw new Error(
          `Пользователь с номером телефона ${phone} уже существует`
        );
      }

      // Создаем пользователя с номером телефона
      const activationCode = generateActivationCode(); // Генерируем код активации
      const user = await UserModel.create({ phone, activationCode });

      // Отправляем код активации (например, по SMS)
      await phoneService.sendActivationCode(phone, activationCode);

      const userDto = new UserDto(user); // id, phone, isActivated
      const tokens = tokenService.generateTokens({ ...userDto });
      await tokenService.saveToken(userDto.id, tokens.refreshToken);

      return {
        ...tokens,
        user: userDto,
        message: `Пользователь зарегистрирован. Одноразовый код: ${activationCode}`,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Регистрация не удалась!");
    }
  }

  async login(phone) {
    const user = await UserModel.findOne({ phone });
    const activationCode = generateActivationCode(); // Генерируем код активации
    if (!activationCode) {
      throw ApiError.BadRequest("Неверный код");
    }
    if (!user) {
      throw ApiError.BadRequest("Пользователь не был найден");
    }
    await phoneService.sendActivationCode(phone, activationCode);
    const userDto = new UserDto(user);
    const tokens = tokenService.generateTokens({ ...userDto });
    await tokenService.saveToken(userDto.id, tokens.refreshToken);

    return {
      ...tokens,
      user: userDto,
      message: `Пользователь вошёл. Одноразовый код: ${activationCode}`,
    };
  }
}

module.exports = new UserService();
