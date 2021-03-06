const read = require('body-parser/lib/read');
const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'), 
      mongoose = require('mongoose'), 
      Models = require('./models.js'), 
      {check, validationResult} = require('express-validator');

const app = express();

// Import respective models defined in model.js
const Movies = Models.Movie;
const Users = Models.User;

/* *********Connect to Local DB ********* */
//mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

/* *********Connect to Hosted DB ********* */
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

/* 
****************** ENDPOINTS DEFINITION ******************
*/

/**
 * GET: Returns welcome message for '/' request URL
 * @returns Welcome message as a string
 */
app.get('/', (req, res) => {
        res.status(200).send('Wlecome to myflix API');
});

/**
 * GET: returns a list of all movies exist in database to the user
 * Request header: Bearer token
 * @return array of movie objects
 * @requires passport
 */
app.get('/movies', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.find()
    .then((movies) => {
        res.status(200).json(movies)
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns detail information about a single movie by its title
 * Request header: Bearer token
 * @param title
 * @returns movie object
 * @requires passport 
 */
app.get('/movies/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { title } = req.params;

    Movies.findOne({Title: title})
    .then((movie) => {
        if(!movie){
            res.status(500).send('movie not found!');
        } else {
            res.status(200).json(movie);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns description of a certain genre by genre title
 * Request header: Bearer token
 * @param title
 * @returns genre description as a string
 * @requires passport 
 */
app.get('/genres/:title', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { title } = req.params;

    Movies.findOne({'Genre.Name': title})
    .then((movie) => {
        if(!movie){
            res.status(400).send('ther is no ' + title + 'movies in our database');
        } else {
            let genreDescription = movie.Genre.Description;
            res.status(200).send(title + ': ' + genreDescription);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * GET: Returns detail information about a certain director by her/his name
 * Request header: Bearer token
 * @param name
 * @returns directors object
 * @requires passport 
 */
app.get('/directors/:name', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { name } = req.params;

    Movies.findOne({'Directors.Name' : name})
    .then((movie) => {
        if(!movie) {
            res.status(400).send('this director is not available in our database!');
        } else {
            res.status(200).json(movie.Directors);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
        
    });
});

/**
 * POST: Allows user to register (username, email and password fields are required)
 * Request header: Bearer token, a JSON including user information
 * @returns user object
 */
app.post('/users', 
    // Checking the validity of username, password, and email
    [
        check('Username', 'Username is required').isLength({min: 3}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Password', 'Password is required').not().isEmpty(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        let newUser = req.body;
        // Converting password to a hashed string 
        let hashedPassword = Users.hashPassword(newUser.Password);

        Users.findOne({'Username' : newUser.Username})
        .then((user) => {
            // If the same username already exists, throw an error
            if(user) {
                res.status(400).send('already exists!');
            } else {
                Users.create({
                    Username: newUser.Username,
                    Password: hashedPassword,  // Store only hashed password
                    Email: newUser.Email,
                    Birthday: newUser.Birthday,
                    Nationality: newUser.Nationality
                })
                .then((user) => {
                    res.status(201).json(user)
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send('Error: ' + err);
                })
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
 * GET: Returns information of a certain user by her/his username
 * Request header: Bearer token
 * @param username
 * @returns user object
 * @requires passport 
 */
app.get('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username } =  req.params;
    
    Users.findOne({Username: username})
    .then((user) => {
        if(!user){
            res.status(500).send('user not found!');
        } else {
            res.status(200).json(user);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

/**
 * PUT: Allow user to update her/his personal information
 * Request header: Bearer token
 * @param username
 * @returns updated user object
 * @requires passport 
 */
app.put('/users/:username', 
    passport.authenticate('jwt', {session: false}),
    // Checking the validity of username and email
    [
        check('Username', 'Username is required').isLength({min: 3}),
        check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
        check('Email', 'Email does not appear to be valid').isEmail()
    ], (req, res) => {

        let errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
        }

        const { username } = req.params;
        let updatedInfo = req.body;
        
        Users.findOneAndUpdate({Username: username}, {$set: 
            {
                Username: updatedInfo.Username,
                Email: updatedInfo.Email,
                Birthday: updatedInfo.Birthday,
                Nationality: updatedInfo.Nationality
            }
        },
        {new: true}, 
        (err, updatedUser) => {
            if(err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

/**
 * POST: Allow user to add a movie by its id to her/his favorit list
 * Request header: Bearer token
 * @param username
 * @param movieid
 * @returns user object
 * @requires passport 
 */ 
app.post('/users/:username/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username, movieid } = req.params;
    Users.findOneAndUpdate({Username: username}, {
        $push: {FavoriteMovies: movieid} // add movieid to the favorite list
    }, 
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

/**
 * DELETE: Allow user to remove a movie by its id from her/his favorit list
 * Request header: Bearer token
 * @param username
 * @param movieid
 * @returns user object
 * @requires passport 
 */
app.delete('/users/:username/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username, movieid } = req.params;

    Users.findOneAndUpdate({Username: username}, {
        $pull: {FavoriteMovies: movieid} // Remove movieid from the favorite list
    }, 
    {new: true},
    (err, updatedUser) => {
        if(err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

/**
 * DELETE: Allow user to deregister by his/her name
 * Request header: Bearer token
 * @param username
 * @returns success message as a string
 * @requires passport 
 */
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username } = req.params;

    Users.findOneAndRemove({Username: username})
    .then((user) => {
        if(!user) {
            // When no user matches username
            res.status(400).send(username + ' was not found!');
        } else {
            // Success message upon deletion
            res.status(200).send(username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
/*
   **********************************************
*/

/**
 * Serves sstatic content for the app from the 'public' directory
 */
 app.use(express.static('public'));


/**
 * defines port, listening to port 8000
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {console.log('listening on Port ' + port ); });
