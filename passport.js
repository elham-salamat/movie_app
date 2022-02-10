const passport = require('passport'),
      LocalStrategy = require('passport-local').Strategy,
      Models = require('./models.js'),
      passportJWT = require('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
    usernameField: 'Username', 
    passwordField: 'Password'

}, (username, password, callback) => {
    Users.findOne({Username: username})
    .then((user) => {
        if(!user) {
            // console.log('incorrect username!');
            return callback(null, false, {message: 'incorrect username or password.'});
        } else {
            // console.log('finished');
            return callback(null, user);
        }
    })
    .catch((err) =>{
        console.log(err);
        return callback(err);
    });
}));

passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
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
