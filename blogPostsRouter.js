const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

// we import the BlogPosts model, which we'll
// interact with in our GET endpoint
const { BlogPost } = require('./models');

// when the root of this route is called with GET, return
// all current BlogPosts items by calling `BlogPosts.get()`
router.get('/', (req, res) => {
  BlogPost
    .find()
    .then(blogPosts => {
      res.json( blogPosts.map(blogPost => blogPost.serialize()));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET' });
    });
});

router.get('/:id', (req, res) => {
  BlogPost
    .findById(req.params.id)
    .then(blogPost => res.json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: GET/:id' });
    });
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author'];
  console.log(req.body);
  requiredFields.forEach(field => {
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }  
  });
    
  BlogPost.create({
    title: req.body.title, 
    content: req.body.content, 
    author: req.body.author
  })
  .then(blogPost => res.status(201).json(blogPost.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: POST' });
    });
});

router.put('/:id', jsonParser, (req, res) => {
  const updated = {};
  const updateableFields = ['title', 'content', 'author'];
  updateableFields.forEach(field => {
    if (field in req.body) {
      updated[field] = req.body[field];
    }
  });

  BlogPost.findByIdAndUpdate(req.params.id, { $set: updated }, { new: true })
    .then(updatedPost => res.status(204).end())
    .catch(err => res.status(500).json({ message: 'Internal server error: PUT' }));
});

router.delete('/:id', jsonParser, (req, res) => {
  BlogPost.findByIdAndRemove(req.params.id)
    .then(() => {
      res.status(204).json({ message: 'success' });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error: DELETE' });
    });
});

module.exports = router;