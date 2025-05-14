import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from "dotenv"
import cookieParser from 'cookie-parser';

import userRoutes from './router/user.route.js';
import promptRoutes from './router/prompt.route.js';

dotenv.config()
const app = express();
const router = express.Router();
const port = process.env.PORT || 3000;
const Mongo_URI = process.env.Mongo_URI

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(Mongo_URI)
  .then(() => console.log('MongoDB Successfully Connected'))
  .catch(err => console.log("Database connection Error",err));


app.use('/api/user',userRoutes);
app.use('/api/deepseekAI', promptRoutes)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

export default app;
