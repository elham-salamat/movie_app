const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      Models = require('./models.js'),
      passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

// Passport strategy to define the basic HTTP authentication for login request
passport.use(new LocalStrategy({
    usernameField: 'Username', 
    passwordField: 'Password'
}, (username, password, callback) => {
    // Check the database for the username
    Users.findOne({Username: username})
    .then((user) => {
        // No user matches username
        if(!user) {
            return callback(null, false, {message: 'Incorrect username.'});
        } 

        // Check the password for its validity
        if (!user.validatePassword(password)) {
            return callback(null, false, {message: 'Incorrect password.'})
        }

        // Username and password matches
        return callback(null, user);
    })
    // Error handling
    .catch((err) =>{
        console.log(err);
        return callback(err);
    });
}));

// Passport strategy to authenticate user based on JWT 
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), // Extraction of JWT from request header
    secretOrKey: 'my-jwt-secret'
}, (jwtPayload, callback) => {
    return Users.findById(jwtPayload._id)
    .then((user) => {
        return callback(null, user);
    })
    .catch((err) => {
        return callback(err);
    });
}));
