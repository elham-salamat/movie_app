const jwtSecret = 'my-jwt-secret';

const jwt = require('jsonwebtoken'), 
      passport = require('passport');

require('./passport');

/**
 * creates a JWT token using HS256 algorithm valid for 7 days long
 * @param {object} user 
 * @returns user object, jwt (token), as well as additional information on token
 */

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username,
        expiresIn: '7d',
        algorithm: 'HS256'
    });
}

/**
 * handles user login, generating a jwt if user login successfully  
 * @param {*} router
 * @returns user object with jwt
 * @requires passport
 */
module.exports= (router) => {
    router.post('/login', (req, res) => {
        passport.authenticate('local',{session: false}, (err, user, info) => {
            if(err || !user) {
                return res.status(400).json({
                    message: 'Something is not right',
                    user: user
                });
            }
            req.login(user, {session: false}, (err) => {
                if(err) {
                    res.send(err);
                }
                // When user exists, a token generates
                let token = generateJWTToken(user.toJSON());
                return res.json({user, token});
            });
        })(req, res);
    });
}