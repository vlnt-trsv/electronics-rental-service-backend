const http = require("http");
const app = require("./app.js");
require("dotenv").config();

const PORT = process.env.PORT;

const server = http.createServer(app);

server.listen(PORT);
