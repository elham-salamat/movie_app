const read = require('body-parser/lib/read');
const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid'), 
      mongoose = require('mongoose'), 
      Models = require('./models.js');

const app = express();

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let auth = require('./auth')(app);

const passport = require('passport');
require('./passport');

// return a list of all movies
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

// return information of a single movie
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

// return description of a genre
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

// return description of a genre
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

// create a new user
app.post('/users', (req, res) => {
    let newUser = req.body;

    Users.findOne({'Username' : newUser.Username})
    .then((user) => {
        if(user) {
            res.status(400).send('already exists!');
        } else {
            Users.create({
                Username: newUser.Username,
                Password: newUser.Password,
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

// update user's personal info
app.put('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username } = req.params;
    let updatedInfo = req.body;
    
    Users.findOneAndUpdate({Username: username}, {$set: 
        {
            Username: updatedInfo.Username,
            Password: updatedInfo.Password,
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

// add a movie to list of user's favoriteMovies 
app.post('/users/:username/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username, movieid } = req.params;
    Users.findOneAndUpdate({Username: username}, {
        $push: {FavoriteMovies: movieid}
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

// remove a movie from list of user's favoriteMovies 
app.delete('/users/:username/:movieid', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username, movieid } = req.params;

    Users.findOneAndUpdate({Username: username}, {
        $pull: {FavoriteMovies: movieid}
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

//delete a user
app.delete('/users/:username', passport.authenticate('jwt', {session: false}), (req, res) => {
    const { username } = req.params;

    Users.findOneAndRemove({Username: username})
    .then((user) => {
        if(!user) {
            res.status(400).send(username + ' was not found!');
        } else {
            res.status(200).send(username + ' was deleted.');
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

app.listen(8080, () => console.log('listening to the request on port 8080.'))
