import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { limiter } from './middlewares/rateLimiter.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(limiter);

app.get("/",(req,res) => {
  res.send("Healthy connection !!!");
});

import questionRoutes from './routes/question.routes.js';

import userRoutes from './routes/user.routes.js';
import languageProcessing from './routes/languageProcessing.routes.js';

app.use("/api/v1/questions", questionRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/bonus", languageProcessing);


export default app;
