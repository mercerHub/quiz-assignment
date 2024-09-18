import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/card'; // Assuming you have a Card component
import { Button } from '../ui/button'; // Assuming you have a Button component
import axiosInstance from '@/utils/axiosInstance';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Problem {
    id: string; // Unique ID for the problem
    question: string;
    options?: string[];
}

interface Answer {
    questionId: string;
    answer: string;
}

function Quiz() {
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState<Problem[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [loading, setLoading] = useState(false);
    const [finalScore, setFinalScore] = useState<number|null>(null);

    useEffect(() => {
        const problems = JSON.parse(localStorage.getItem('questions') || '[]');
        console.log('Fetched problems:', problems);

        if (problems.length === 0) {
            console.log('No questions found');
        } else {
            setQuiz(problems);
        }
    }, []);

    // Handle changes in user input
    const handleInputChange = (questionId: string, value: string) => {
        setAnswers((prevAnswers) => {
            const existingAnswer = prevAnswers.find((ans) => ans.questionId === questionId);
            if (existingAnswer) {
                // Update existing answer
                return prevAnswers.map((ans) =>
                    ans.questionId === questionId ? { ...ans, answer: value } : ans
                );
            } else {
                // Add new answer
                return [...prevAnswers, { questionId, answer: value }];
            }
        });
    };
    const goBack = () => {
        navigate('/dashboard');
    }

    // Submit the quiz (handle the submit logic here)
    const handleSubmit = async () => {
        setLoading(true);
        console.log('Submitted Answers:', answers);
        try {
            const response = await axiosInstance.post('/questions/checkSolution', {
                solutionData: answers,
            }).then(res => res.data);
            console.log('Response from server:', response.data.pointsGained);
            setFinalScore(response.data.pointsGained);
        } catch (error: any) {
            console.error('Error submitting quiz:', error);
        } finally {
            // Clear the quiz data from local storage
            localStorage.removeItem('questions');
            setQuiz([]);
            setAnswers([]);
            
            setLoading(false);
        }
    };

    return (
        <div className="quiz-container p-4 mx-auto bg-black w-screen flex items-center justify-center min-h-screen h-fit">
            <Card className="w-full lg:w-1/2 p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Quiz</CardTitle>
                    <CardDescription className="text-gray-600">Answer the following questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {quiz.length > 0 ? (
                        quiz.map((problem) => (
                            <div key={problem.id} className="quiz-question space-y-4">
                                <h1 className="text-lg font-semibold">{problem.question}</h1>
                                {problem.options ? (
                                    // For multiple-choice questions
                                    <ul className="space-y-2">
                                        {problem.options.map((option, idx) => (
                                            <li key={idx} className="flex items-center space-x-3">
                                                <input
                                                    type="radio"
                                                    id={`option-${problem.id}-${idx}`}
                                                    name={`question-${problem.id}`}
                                                    value={option}
                                                    onChange={() => handleInputChange(problem.id, option)}
                                                    className="focus:ring-2 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                                />
                                                <label htmlFor={`option-${problem.id}-${idx}`} className="text-gray-700">
                                                    {option}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    // For descriptive or fill-in-the-blank questions
                                    <div>
                                        <textarea
                                            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            placeholder="Type your answer here..."
                                            rows={4}
                                            onChange={(e) => handleInputChange(problem.id, e.target.value)}
                                        />
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p 
                        onClick={goBack}
                        className="text-gray-600 hover:text-gray-700 hover:decoration-slate-600 hover:cursor-pointer">Go back to dashboard....</p>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <div>
                        {finalScore !== null && <p className="text-green-700 font-semibold text-lg">Your final score: {finalScore}</p>}
                    </div>
                    <Button onClick={handleSubmit} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                        {loading ? <Loader2 className='animate-spin'/>: "Submit"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

export default Quiz;
