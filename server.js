const express = require('express');
// we'll use morgan to log the HTTP layer
const morgan = require('morgan');
// we'll use body-parser's json() method to 
// parse JSON data sent in requests to this app
const bodyParser = require('body-parser');

// we import the BlogPosts model, which we'll
// interact with in our GET endpoint
const {BlogPosts} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to BlogPosts
// so there's some data to look at. Note that 
// normally you wouldn't do this. Usually your
// server will simply expose the state of the
// underlying database.
BlogPosts.create('For Sale', 'Selling an iPad mini for $100', 'Maddie R');
BlogPosts.create('Recipe', 'Need a recipe for tomato soup', 'Sammy Hernandez');
BlogPosts.create('Free', 'Free rose bush for anyone interested', 'Grace Buchanan');

// when the root of this route is called with GET, return
// all current ShoppingList items by calling `ShoppingList.get()`
app.get('/blog-posts', (req, res) => {
  res.json(BlogPosts.get());
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
