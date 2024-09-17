import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/user.model.js'; 

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(400, 'Unauthorized request');
        }

        // Verify the token
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        // Fetch user from database using Sequelize
        const user = await User.findByPk(decodedToken.id); // Ensure `id` is the correct attribute

        if (!user) {
            throw new ApiError(401, 'Invalid Access Token');
        }

        req.user = user;
        console.log(user);
        next();
    } catch (error) {
        throw new ApiError(403, error?.message || 'Invalid Access Token');
    }
});
