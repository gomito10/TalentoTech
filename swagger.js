import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de productos y usuarios',
      version: '1.0.0',
      description: 'Documentación completa para gestionar productos y usuarios',
    },
    servers: [
      {
        url: 'http://localhost:5000/api', // ⚠️ Usar URL completa si querés probar en Swagger UI
        description: 'Servidor local para productos'
      },{
        url: 'http://localhost:5000/auth',//Usar URL completa si querés probar en Swagger UI
        description: 'Servidor local para usuarios'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Producto: {
          type: 'object',
          properties: {
            description: { type: 'string' },
            title: { type: 'string' },
            price: { type: 'number' },
            category: { type: 'string' }
          },
          required: ['title', 'price', 'category']
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            username: { type: 'string' },
            email: { type: 'string' }
          },
          required: ['username', 'email']
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'], // 👈 Asegurate que tus comentarios Swagger estén ahí
};

const specs = swaggerJsdoc(options);

export { specs, swaggerUi };