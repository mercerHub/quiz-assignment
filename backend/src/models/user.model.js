import { DataTypes } from 'sequelize';
import sequelize from '../db/index.js'; // Adjust the path to your db configuration
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    set(value) {
      this.setDataValue('username', value.toLowerCase()); // Convert to lowercase
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    set(value) {
      this.setDataValue('name', value.trim()); // Trim whitespace
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  points:{
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  refreshToken: {
    type: DataTypes.STRING,
  }
}, {
  timestamps: true, // Automatically manage createdAt and updatedAt fields
});

// hashPassword hook
User.beforeCreate(async (user, options) => {
    if (user.password) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
});

User.beforeUpdate(async (user, options) => {
    if (user.changed('password')) {
        const hash = await bcrypt.hash(user.password, 10);
        user.password = hash;
    }
});

User.prototype.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
};

User.prototype.generateAccessToken = function() {
    return jwt.sign(
        {
            id: this.id,
            email: this.email,
            username: this.username,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}

User.prototype.generateRefreshToken = function() {
    return jwt.sign(
        {
            id: this.id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    );
};

sequelize.sync().then(() => {
    console.log('User table created');
});

export default User;
