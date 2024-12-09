import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Test-task-for-bothub API',
    version: '1.0.0',
  },
  servers: [
    {
      url: 'http://localhost/api/v1',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/v1/*-routes.ts', './src/routes/v1/swagger/components.yaml'],
};

export const swaggerSpec = swaggerJSDoc(options);


