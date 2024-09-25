const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
        next(); 
};