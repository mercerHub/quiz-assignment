import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { Op } from "sequelize";
import jwt from 'jsonwebtoken';


const generateAccessAndRefreshToken = async (userId) => {
    try {
        // Find the user by primary key
        const user = await User.findByPk(userId);

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Update user with the new refresh token
        user.refreshToken = refreshToken;
        await user.save({ fields: ['refreshToken'] }); // Only update the refreshToken field

        return { accessToken, refreshToken };
    } catch (error) {
        console.error("Error generating tokens:", error.message);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};

const registerUser = asyncHandler(async (req, res) => {
    const { username, name, email, password } = req.body;

    // Check for missing fields
    if ([username, name, email, password].some(field => !field || field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existsUser = await User.findOne({
        where: {
            [Op.or]: [
                { username },
                { email }
            ]
        }
    });

    if (existsUser) {
        throw new ApiError(409, "User already exists");
    }

    // Create a new user
    const user = await User.create({
        username: username.toLowerCase(),
        name,
        email: email.toLowerCase(),
        password,
    });

    // Find the created user without sensitive information
    const createdUser = await User.findByPk(user.id, {
        attributes: { exclude: ['password', 'refreshToken'] }
    });

    if (!createdUser) {
        throw new ApiError(500, "User not created");
    }

    res.status(201).json(new ApiResponse(201, createdUser, "User created successfully"));
});

const login = asyncHandler(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
    
        if (!email?.trim() || !password?.trim()) {
        throw new ApiError(400, "Email and password are required");
        }
    
        const user = await User.findOne({ 
            where: { email } 
        });

        if (!user) {
            throw new ApiError(404, "User not found");
        }

        const isPasswordCorrect = await user.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(401, "Invalid credentials");
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);

        const loggerUser = await User.findByPk(user.id,{
            attributes: {
                exclude: ['password', 'refreshToken']
            }
        })

        const options = {
            httpOnly: true,
            secure:true,
        };

        res
        .status(200)
        .cookie("refreshToken", refreshToken, options)
        .cookie("accessToken", accessToken, options)
        .json(new ApiResponse(200,{ loggerUser, accessToken, refreshToken }, "User logged in successfully"));


    } catch (error) {
        throw new ApiError(500, error.message || "Something went wrong while logging in");
    }
});

const refreshTokens = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
    }

    try {
        // Verify the refresh token
        const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Find the user with the given ID
        const user = await User.findByPk(decodedToken.id);

        if (!user || user.refreshToken !== refreshToken) {
            throw new ApiError(401, 'Invalid refresh token');
        }

        // Generate new access and refresh tokens
        const accessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        // Update the user with the new refresh token
        user.refreshToken = newRefreshToken;
        await user.save({ fields: ['refreshToken'] });

        res.status(200).json({
            accessToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        throw new ApiError(401, 'Invalid refresh token');
    }
});

export {
    login,
    registerUser,
    refreshTokens
}