import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import Question from "../models/questions.model.js"; // Import the Sequelize model
import User from "../models/user.model.js";

const getQuestions = asyncHandler(async (req, res, next) => {
  try {
    // Use Sequelize to fetch all questions
    const questions = await Question.findAll({});

    if (questions.length === 0) {
      throw new ApiError(404, "No questions found");
    }

    res.status(200).json(new ApiResponse(200, questions));
  } catch (error) {
    next(error);
  }
});

const checkSolution = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { solutionData } = req.body;
    console.log(solutionData);
    let pointsGained = 0;
    const result = [];
    await Promise.all(solutionData.map(async (data) => {
      if (!data.questionId) {
          throw new ApiError(400, "Invalid solution data");
      }
      const question = await Question.findByPk(data.questionId);
  
      if (!question) {
          throw new ApiError(404, "Question not found");
      }
  
      const correctAnswer = question.correct_answer;
      const points = question.score;
      if (correctAnswer === data.answer) {
          pointsGained += points;
          result.push({ questionId: data.questionId, correct: true });
      }
      else {
          result.push({ questionId: data.questionId, correct: false });
      }
  }));

    if(pointsGained > 0){
        const user = await User.findByPk(userId);
        console.log(user);
        user.points += pointsGained;
        await user.save();
    }

    res.status(200).json(new ApiResponse(200, {result,pointsGained} , "Solution checked successfully"));
  } catch (error) {
    next(error);
  }
});

export { getQuestions, checkSolution };
