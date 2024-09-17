import sequelize from './db/index.js';
import Question from './models/questions.model.js';

const questions = [
    {
        type: 'mcq',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correct_answer: 'Paris',
        score: 1
    },
    {
        type: 'mcq',
        question: 'Is the Earth flat?',
        options: ['True', 'False'],
        correct_answer: 'False',
        score: 1
    },
    {
        type: 'fill-in-the-blank',
        question: 'The largest planet in our solar system is ___________.',
        options: null,
        correct_answer: 'Jupiter',
        score: 1
    },
    {
        type: 'descriptive',
        question: 'Explain the importance of recycling in modern society.',
        options: null,
        correct_answer: null,
        score: 2
    }
];

const seed = async () => {
    try {
        // Sync the model with the database
        await sequelize.sync({ force: true }); // Use force: true to drop and recreate tables
        console.log('Questions table created successfully');

        // Insert questions into the table
        for (const question of questions) {
            const createdQuestion = await Question.create(question);
            console.log('Question inserted:', createdQuestion.toJSON());
        }
    } catch (error) {
        console.error('Error creating questions table or inserting data', error);
    } finally {
        await sequelize.close(); // Close the database connection
    }
};

seed();
