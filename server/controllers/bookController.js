const Book = require('../models/bookModel');

// Check if the book exists by title
exports.checkBook = async (req, res) => {
  try {
    const { title } = req.body;
    // const book = await Book.findOne({ title });

    const book = await Book.find({
      $or: [
        { title: { $regex: title, $options: "i" } },
        { description: { $regex: title, $options: "i" } },
        { author: { $regex: title, $options: "i" } }
      ]
    });
    if (book) {
      console.log("bookchecked",book);
      return res.status(200).json({ message: 'Book exists', book });
    }

    return res.status(404).json({ message: 'Book does not exist' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Add a new book
exports.addBook = async (req, res) => {
  try {
    const { title, author, coverUrl, description, userId, genre } = req.body;
    console.log("userId",userId,req.body);
   
    const existingBook = await Book.findOne({ title });
    if (existingBook) {
      return res.status(200).json({ message: "Book already exists", bookId: existingBook._id });
    }
     // Validate that userId is provided
     if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const newBook = new Book({
      title,
      author,
      coverUrl,
      description,
      userId,
      genre,
      averageRating: 0
    });
    const savedBook = await newBook.save();
    return res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error adding book' });
  }
};

exports.getBooksByUser = async (req, res) => {
  try {
      const { userId } = req.params;

      const books = await Book.find({ userId });
      console.log("books",books);
      res.status(200).json(books);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
  }
};
