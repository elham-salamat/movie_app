const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true}, 
    Description: {type: String, required: true}, 
    ReleasedYear: Number, 
    Country: String, 
    Genre: {
        Name: String,
        Description: String
    },
    Directors: {
        Name: String, 
        Bio: String,
        BirthYear: Number,
        DeathYear: Number
    },
    ImageUrl: String, 
    Featured: Boolean, 
    Rating: Number
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true}, 
    Birthday: Date,
    Nationality: String,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;


