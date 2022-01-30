const express = require('express'),
      bodyParser = require('body-parser'),
      uuid = require('uuid');

const app = express();

app.use(bodyParser.json());

let movies = [
    {
        'id' : 1, 
        'title': 'My salinger year', 
        'director': 'Philippe Falardeau', 
        'genre': 'action'
    }, 
    {
        'id' : 2, 
        'title': 'Palmer', 
        'director': 'Fisher Stevens',
        'genre': 'comedy'
    }, 
    {
        'id' : 3, 
        'title': 'Blue Bayou', 
        'director': 'Justin Chon',
        'genre': 'action'
    }, 
    {
        'id' : 4, 
        'title': 'Cruella', 
        'director': 'Craig Gillespie',
        'genre': 'Thriller'
    }, 
    {
        'id' : 5, 
        'title': 'Percy vs Goliath', 
        'director': 'Clark Johnson',
        'genre': 'fantasy'

    }, 
    {
        'id' : 6, 
        'title': 'Pixie', 
        'director': 'Barnaby Thompson',
        'genre': 'mystery'
    }, 
    {
        'id' : 7, 
        'title': 'The world to come', 
        'director': 'Mona Fastvold',
        'genre': 'comedy'

    }, 
    {
        'id' : 8, 
        'title': 'The mauritanian', 
        'director': 'Kevin Macdonald',
        'genre': 'Thriller'

    }, 
    {
        'id' : 9, 
        'title': 'Spoor', 
        'director': 'Agnieszka Holland and Kasia Adamik',
        'genre': 'mystery'

    }, 
    {
        'id' : 10, 
        'title': 'Son', 
        'director': 'Ivan Kavanagh',
        'genre': 'Thriller'

    }, 
];

let genres = {
    'action' : 'An action story is similar to adventure, and the protagonist usually takes a risky turn, which leads to desperate situations. Action and adventure are usually categorized together (sometimes even as "action-adventure") because they have much in common, and many stories fall under both genres simultaneously.',
    'comedy': 'Comedy is a story that tells about a series of funny, or comical events, intended to make the audience laugh. It is a very open genre, and thus crosses over with many other genres on a frequent basis.',
    'mystery': 'Science fiction (once known as scientific romance) is similar to fantasy, except stories in this genre use scientific understanding to explain the universe that it takes place in.',
    'thriller': 'A thriller is a story that is usually a mix of fear and excitement. It has traits from the suspense genre and often from the action, adventure or mystery genres, but the level of terror makes it borderline horror fiction at times as well. It generally has a dark or serious theme, which also makes it similar to drama.',
    'fantasy': 'A fantasy story is about magic or supernatural forces, as opposed to technology as seen in science fiction. Depending on the extent of these other elements, the story may or may not be considered to be a "hybrid genre" series; for instance, even though the Harry Potter series canon includes the requirement of a particular gene to be a wizard, it is referred to only as a fantasy series.'
};

let directors = [
    {
        'id': 1, 
        'fullName': 'Ivan Kavanagh',
        'age': 45,
        'works': ['film1', 'film2', 'film3', 'film4']
    },
    {
        'id': 2, 
        'fullName': 'Kevin Macdonald',
        'age': 58,
        'works': ['film1', 'film2', 'film3', 'film4']
    }, 
    {
        'id': 3, 
        'fullName': 'Asghar Farhadi',
        'age': 48,
        'works': ['film1', 'film2', 'film3', 'film4']
    }
];

let users = [
    {
        'id': 1, 
        'name': 'ali',
        'age': 23,
        'favoriteMovies': []
    },
    {
        'id': 2, 
        'name': 'sara',
        'age': 11,
        'favoriteMovies': []
    }, 
    {
        'id': 3, 
        'name': 'hadi',
        'age': 47,
        'favoriteMovies': []
    }
];

// return a list of all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// return information of a single movie
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;

    let movie = movies.find((movie) => { return movie.id == id });

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('there is not such movie');
    }
})

// return description of a genre
app.get('/genres/:title', (req, res) => {
    const { title } = req.params;

    function genreDescription(title) {
        for (const[key, value] of Object.entries(genres)) {
            if (key == title) {
                return value
            }
        }
    }

    let genre = genreDescription(title);

    if (genre) {
        res.status(200).send(`${title}: ${genre}`);
    } else {
        res.status(400).send('there is not such genre');
    }
});

// return description of a genre
app.get('/directors/:name', (req, res) => {
    const { name } = req.params;

    let director = directors.find((director) => { return director.fullName == name});

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('director is not found!');
    }
});

// create a new user
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (newUser.name) {
        // let user = users.find( user => {return user.name = newUser.name});
        // if (user) {
        //     res.status(400).send('the user already exists!')
        // } else {
            newUser.id = uuid.v4();
            users.push(newUser);
            res.status(201).send(newUser);
        // }
    } else {
        res.status(400).send('a user name should be insert!')
    }
});

// update user's personal info
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;

    let user = users.find((user) => { return user.id == id });

    if (user) {
        user.name = updatedUser.name;
        user.age = updatedUser.age;
        res.status(200).json(user);
    } else {
        res.status(404).send('the user is nor found!');
    }
});

// add or remove a movie to/from list of user's favoriteMovies 
app.put('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find((user) => {return user.id == id});

    if (user) {
        if (user.favoriteMovies.includes(movieTitle)) {
            user.favoriteMovies = user.favoriteMovies.filter(movie => movie != movieTitle);
            res.status(200).send('the movie was successfuly deleted from your favoritelist!');
        } else {
            user.favoriteMovies.push(movieTitle)
            res.status(201).send('the movie was successfuly added to your favoritelist!');
        }

    } else {
        res.status(404).send('user not found!');
    }
});

//delete a user
app.delete('/users/:userId', (req, res) => {
    const { userId } = req.params;
    let user = users.find((user) => { return user.id == userId });

    if (user) {
        users = users.filter( user => user.id != userId );
        res.status(200).send(`user ${userId} was successfully deleted!`);
    } else {
        res.status(400).send('user not found!')
    }
});

app.listen(8080, () => console.log('listening to the request on port 8080.'))
