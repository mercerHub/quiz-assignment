import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError.js';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: new ApiError(429, "Too many requests, please try again later."),
  headers: true, 
});

export { limiter };
