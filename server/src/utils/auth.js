// src/utils/auth.js
const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, username: user.username }, 
    process.env.JWT_SECRET || 'testsecret',   
    { expiresIn: '1h' }
  );
};

module.exports = { generateToken };
