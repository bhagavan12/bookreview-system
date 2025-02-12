const express = require('express');
const { checkBook, addBook,getBooksByUser } = require('../controllers/bookController');

const router = express.Router();

// Route to check if a book exists by title
router.post('/check', checkBook);

// Route to add a new book
router.post('/add', addBook); 
router.get('/:userId', getBooksByUser); 

module.exports = router;
