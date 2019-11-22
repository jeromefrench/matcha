var jwt = require('jsonwebtoken');

const JWT_SIGN_SECRET = '0gtrdg546hretsdyj86jtr5djhyd876j4tsjy8d6jry';

exports.generateTokenForUser = function(userData){
    return jwt.sign({
        userId: userData
    },
    JWT_SIGN_SECRET,
    {
        expiresIn: '1h'
    });
}