const { request } = require('express');
const express = require('express'), 
      morgan = require('morgan');
const app = express();


myFavoriteMovies = [
    {
        'title': 'My salinger year', 
        'director': 'Philippe Falardeau'
    }, 
    {
        'title': 'Palmer', 
        'director': 'Fisher Stevens'
    }, 
    {
        'title': 'Blue Bayou', 
        'director': 'Justin Chon'
    }, 
    {
        'title': 'Cruella', 
        'director': 'Craig Gillespie'
    }, 
    {
        'title': 'Percy vs Goliath', 
        'director': 'Clark Johnson'
    }, 
    {
        'title': 'Pixie', 
        'director': 'Barnaby Thompson'
    }, 
    {
        'title': 'The world to come', 
        'director': 'Mona Fastvold'
    }, 
    {
        'title': 'The mauritanian', 
        'director': 'Kevin Macdonald'
    }, 
    {
        'title': 'Spoor', 
        'director': 'Agnieszka Holland and Kasia Adamik'
    }, 
    {
        'title': 'Son', 
        'director': 'Ivan Kavanagh'
    }, 
];

app.use(morgan('common'));
app.use(express.static('public'));

// GET requests 
app.get('/', (req, res) => {
    res.send('here is the homepage of myFlix');
});

app.get('/movies', (req, res) => {
    res.json(myFavoriteMovies);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('something is broken');
});

app.listen(8080, () => {
    console.log('my app is running on 8080');
})