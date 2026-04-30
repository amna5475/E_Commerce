const swaggerJsDoc = require('swagger-jsdoc');
const config = require('config');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'E-commerce API',
      version: '1.0.0',
      description: 'Modular E-commerce REST API Documentation',
      contact: {
        name: 'Developer'
      },
      servers: [
        {
          url: `http://localhost:${config.get('app.port')}`,
          description: 'Development Server'
        }
      ]
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = swaggerDocs;
