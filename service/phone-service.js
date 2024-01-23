const { generateActivationCode } = require("../utils/authentication");

class PhoneService {
  async sendActivationCode(phone) {
    try {
      const activationCode = generateActivationCode();
      console.log(`Generated activation code: ${activationCode}`);

      // Отправка кода активации (ваш код отправки SMS или другого уведомления)
      console.log(`Activation code sent to ${phone}`);
    } catch (error) {
      console.error(`Failed to send activation code to ${phone}`, error);
      throw new Error("Failed to send activation code");
    }
  }
}

module.exports = PhoneService;
