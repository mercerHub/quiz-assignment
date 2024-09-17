import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import Question from '../models/questions.model.js'; // Import the Sequelize model

const getQuestions = asyncHandler(async (req, res, next) => {
    try {
        // Use Sequelize to fetch all questions
        const questions = await Question.findAll({
            attributes: [
                ['id', 'ID'],
                ['type', 'TYPE'],
                ['question', 'QUESTION'],
                ['options', 'OPTIONS'],
            ]
        });

        if (questions.length === 0) {
            throw new ApiError(404, 'No questions found');
        }

        res.status(200).json(new ApiResponse(200, questions));
    } catch (error) {
        next(error);
    }
});

export {
    getQuestions
};
