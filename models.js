const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true}, 
    Description: {type: String, required: true}, 
    ReleasedYear: Number, 
    Country: [], 
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
    ImagePath: String, 
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

userSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

userSchema.methods.validatePassword = function(password) {
    return bcrypt.compareSync(password, this.Password);
}

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.User = User;


