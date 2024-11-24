require('dotenv').config();
import { createNamespace } from 'cls-hooked';
import * as postgres from 'pg';
import { Sequelize, SyncOptions } from 'sequelize';

const PORT = +(process.env.DB_PORT || 5432)

const namespace = createNamespace('sequelize')

Sequelize.useCLS(namespace)

const db = new Sequelize({
  dialect: 'postgres',
  dialectModule: postgres,
  
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  
  host: process.env.DB_HOST,
  port: PORT,
  database: process.env.DB_NAME,
  
  timezone:'+00:00',
  define: {
    timestamps: false
  }
})

export default db

export async function openConnection(options?: SyncOptions) {
  await db.sync({
    alter: true,
    ...options,
  })
}

export function closeConnection() {
  return db.close()
}