require('dotenv').config();

module.exports = {
  app: {
    port: process.env.PORT || 3000,
    jwt_secret: process.env.JWT_SECRET || '',
    jwt_expiration: '24h'
  },
  database: {
    dbName: process.env.POSTGRES_DBNAME,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASS,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    dialect: 'postgres',
    settings: {
      dbConnections: {
        max: 5,
        min: 0
      },
      idleTime: 10000,
      acquireDB: 30000,
      evictDB: 1000
    }
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  }
};
