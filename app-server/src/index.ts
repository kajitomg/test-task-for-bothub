require('dotenv').config()
import express from 'express';
import models from './models';
import { openConnection } from './db';
import router from './routes';

const PORT = process.env.PORT || 5000

const app = express()

app.use('/api', router)

app.listen(PORT, async () => {
  console.log(`Server has been started on port ${PORT}`);
  models
  await openConnection();
})

