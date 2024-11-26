require('dotenv').config()
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import errorMiddleware from './middlewares/error-middleware';
import models from './models';
import { openConnection } from './db';
import router from './routes';

const PORT = process.env.PORT || 3000

const app = express()

app.use(cors({
  credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

//app.use(authMiddleware)

app.use('/api', router)

app.use(errorMiddleware)

app.listen(PORT, async () => {
  console.log(`Server has been started on port ${PORT}`);
  models
  await openConnection();
})

