// Генерация одноразового кода
const generateActivationCode = () => {
    const codeLength = 4; // Длина кода активации
    const characters = '0123456789';
    let code = '';

    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }

    return code;
  };

  // Отправка кода активации (пример, вывод в консоль)
  const sendActivationCode = (phone, code) => {
    console.log(`Sending activation code ${code} to ${phone}`);
    // В реальном приложении здесь следует использовать метод отправки SMS или другие средства
  };

  module.exports = {
    generateActivationCode,
    sendActivationCode,
  };
