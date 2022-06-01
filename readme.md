# Rest API (Movies-API)

## Description
This API was developed to build the serverside component of a movies web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies. 

### User Stories
* As a user, I want to be able to receive information on movies, directors, and genres so that I can learn more about movies I’ve watched or am interested in. 
* As a user, I want to be able to create a proﬁle so I can save data about my favorite movies.
* As a user, I want to be able to edit my personal information as well as deregister whenever I want.

### Key Features 
* Return a list of ALL movies to the user 
* Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user  
* Return data about a genre (description) by name/title (e.g., “Thriller”) 
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register 
* Allow users to update their user info (username, email, date of birth) 
* Allow users to add a movie to their list of favorites 
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister 

### What do I learned from this project
As a beginner, this project gives me that chance to learn following topics: 
* I learned how to implement the backend of the app (including authentication) using Node.js and express. I also get familiar with the very useful tools in developement process like nodemon.
* I got the chance to fully understand the REST API architecture and how to orgenize the project files when implementing multiple routes and endpoints. 
* I learned how to use special tools like postman to test the endpoints and handling the errors. 
* good understanding of non-relational databases like MongoDB was also another highlight of the project. 
* I learned how to use free cloud providers such as MongoDB atlas to deploy my database as well as Heroku to deploy the app. 
* I also could extend my knowledge on git, making it easier for me to work and communicate in a team in my next career.

## Necessary steps in developement process
when cloning or downloading the repository, follow the following steps if you want to work on the project: 

### Installation of Node.js
[Choose the suitable version for your OS](https://nodejs.org/en/)

### Installation of express and all dependencies and express middleware
```
npm install --save express uuid body-parser
npm install morgan --save
npm install --save passport passport-local passport-jwt jsonwebtoken
npm install mongoose
```

### Download and installation of MongoDB
[download and install MongoDB](https://www.mongodb.com/try/download/community)

### Create and populate non-relational database MongoDB
* sketch the structure of database (with the help of user stories and well as documentation.html) usinh database schema diagram. 
* install MongoDb database Tools
* use Mongo Shell to create database with CRUD operations
* create the 2 collections "movies" and "users".
* add 10 documents to the "movies" collection (including embedded documents for the keys "genre" and "director").
* uncomment the following code line in index.js and do not forget to replace "myFlixDB" with your database name
 *mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });*
* comment the following code line in index.js 
 *mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });*

### Start the server
```
npm run start
```
### Check the documentation
open the documentation.html in public folder

### Creation of HTTP endpoints and route handlers (mentioned in documentation.html) in postman to test the API functionality  



## Hosting on MongoDBAtlas (DBaaS) and HEROKU (PaaS)
### Steps
* register with heroku, install toolbelt
* change port
* create Heroku app
* create mongodb instance on MongoDBAtlas
* export MongoDB database with mongodump
* push Git main to Heroku
* comment the following code line in index.js
 *mongoose.connect('mongodb://localhost:27017/dbname', { useNewUrlParser: true, useUnifiedTopology: true });*
* uncomment the following code line in index.js **do not forget define CONNECTION_URI as environment variable**
 *mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });*
