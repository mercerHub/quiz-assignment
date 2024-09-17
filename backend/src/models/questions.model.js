import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js'; // Adjust the path to your Sequelize instance

const Question = sequelize.define('Question', {
    type: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    question: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    options: {
        type: DataTypes.TEXT, // Options can be stored as JSON in TEXT format
        get() {
            const value = this.getDataValue('options');
            return value ? JSON.parse(value) : null;
        },
        set(value) {
            this.setDataValue('options', value ? JSON.stringify(value) : null);
        }
    },
    correct_answer: {
        type: DataTypes.STRING,
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    timestamps: false, // Disable automatic createdAt and updatedAt fields
});

export default Question;
