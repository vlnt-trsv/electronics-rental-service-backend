require("dotenv").config();
const http = require("http");
const app = require("./app.js");

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
  });
