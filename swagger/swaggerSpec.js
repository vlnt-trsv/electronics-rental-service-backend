const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    swagger: "2.0",
    info: {
      description: "API для управления заказами в сервисе аренды электроники.",
      version: "1.0.0",
      title: "Orders API",
    },
    host: "localhost:5000",
    basePath: "/api/v1",
    tags: [
      {
        name: "orders",
        description: "Операции по заказам",
      },
      {
        name: "users",
        description: "Операции с пользователями",
      },
      {
        name: "products",
        description: "Операции с продуктами",
      },
    ],
    schemes: ["http"],
    paths: {
      // Путь для работы с заказами (уже определен)
      "/orders": {
        get: {
          tags: ["orders"],
          summary: "Получение списка всех заказов",
          operationId: "ordersGetAll",
          produces: ["application/json"],
          responses: {
            200: {
              description: "Успешное получение списка заказов",
              schema: {
                type: "array",
                items: {
                  $ref: "#/definitions/Order",
                },
              },
            },
          },
        },
        post: {
          tags: ["orders"],
          summary: "Создание нового заказа",
          operationId: "ordersCreateOrder",
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            {
              in: "body",
              name: "body",
              description: "Объект заказа, который необходимо создать",
              required: true,
              schema: {
                $ref: "#/definitions/Order",
              },
            },
          ],
          responses: {
            201: {
              description: "Заказ успешно создан",
            },
          },
        },
      },
      "/orders/{orderId}": {
        get: {
          tags: ["orders"],
          summary: "Получение детальной информации о конкретном заказе",
          operationId: "ordersGetOrder",
          produces: ["application/json"],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              type: "string",
              description: "ID заказа для получения",
            },
          ],
          responses: {
            200: {
              description: "Детальная информация о заказе",
              schema: {
                $ref: "#/definitions/Order",
              },
            },
          },
        },
        delete: {
          tags: ["orders"],
          summary: "Удаление заказа",
          operationId: "ordersDeleteOrder",
          produces: ["application/json"],
          parameters: [
            {
              name: "orderId",
              in: "path",
              required: true,
              type: "string",
              description: "ID заказа для удаления",
            },
          ],
          responses: {
            200: {
              description: "Заказ успешно удален",
            },
          },
        },
      },

      // Путь для работы с пользователями
      "/users": {
        get: {
          tags: ["users"],
          summary: "Получение списка всех пользователей",
          operationId: "usersGetAll",
          produces: ["application/json"],
          responses: {
            200: {
              description: "Успешное получение списка пользователей",
              schema: {
                type: "array",
                items: {
                  $ref: "#/definitions/User",
                },
              },
            },
          },
        },
        post: {
          tags: ["users"],
          summary: "Создание нового пользователя",
          operationId: "usersCreateUser",
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            {
              in: "body",
              name: "body",
              description: "Объект пользователя, который необходимо создать",
              required: true,
              schema: {
                $ref: "#/definitions/User",
              },
            },
          ],
          responses: {
            201: {
              description: "Пользователь успешно создан",
            },
          },
        },
      },
      // Путь для работы с продуктами
      "/products": {
        get: {
          tags: ["products"],
          summary: "Получение списка всех продуктов",
          operationId: "productsGetAll",
          produces: ["application/json"],
          responses: {
            200: {
              description: "Успешное получение списка продуктов",
              schema: {
                type: "array",
                items: {
                  $ref: "#/definitions/Product",
                },
              },
            },
          },
        },
        post: {
          tags: ["products"],
          summary: "Создание нового продукта",
          operationId: "productsCreateProduct",
          consumes: ["application/json"],
          produces: ["application/json"],
          parameters: [
            {
              in: "body",
              name: "body",
              description: "Объект продукта, который необходимо создать",
              required: true,
              schema: {
                $ref: "#/definitions/Product",
              },
            },
          ],
          responses: {
            201: {
              description: "Продукт успешно создан",
            },
          },
        },
      },
    },
    definitions: {
      Order: {
        type: "object",
        required: ["id", "product", "quantity"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Уникальный идентификатор заказа",
          },
          product: {
            type: "string",
            description: "ID продукта",
          },
          quantity: {
            type: "integer",
            format: "int32",
            description: "Количество заказанного продукта",
          },
        },
      },
      User: {
        type: "object",
        required: ["id", "username"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Уникальный идентификатор пользователя",
          },
          username: {
            type: "string",
            description: "Имя пользователя",
          },
        },
      },
      Product: {
        type: "object",
        required: ["id", "name"],
        properties: {
          id: {
            type: "string",
            format: "uuid",
            description: "Уникальный идентификатор продукта",
          },
          name: {
            type: "string",
            description: "Название продукта",
          },
        },
      },
    },
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
  apis: ["./api-docs.yaml"],
};

module.exports = swaggerJsdoc(options);
