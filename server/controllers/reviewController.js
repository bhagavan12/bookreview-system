const Review = require("../models/reviewModel");
const Book = require("../models/bookModel");

// Add a comment
exports.addComment = async (req, res) => {
  try {
    const { bookId, userId, comment } = req.body;

    if (!bookId || !userId || !comment) {
      return res.status(400).json({ message: "Book ID, User ID, and comment are required." });
    }

    const review = await Review.findOneAndUpdate(
      { bookId },
      { $push: { comments: { userId, comment, timestamp: new Date() } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ message: "Comment added successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add comment.", error: error.message });
  }
};
// Edit a comment
exports.editComment = async (req, res) => {
  try {
    const { bookId, commentId, userId, newComment } = req.body;

    if (!bookId || !commentId || !userId || !newComment) {
      return res.status(400).json({ message: "Book ID, Comment ID, User ID, and new comment are required." });
    }

    // const review = await Review.findOneAndUpdate(
    //   {
    //     bookId,
    //     "comments._id": commentId,
    //     "comments.userId": userId,
    //   },
    //   {
    //     $set: { "comments.$.comment": newComment },
    //     $push: {
    //       "comments.$.editHistory": {
    //         oldComment: newComment,
    //         editedAt: new Date(),
    //       },
    //     },
    //   },
    //   { new: true }
    // );
    const review = await Review.findOneAndUpdate(
      {
        bookId,
        "comments._id": commentId,  // Ensure we're targeting the correct comment
        "comments.userId": userId,
      },
      {
        $set: { "comments.$[elem].comment": newComment },
        $push: {
          "comments.$[elem].editHistory": {
            oldComment: newComment,
            editedAt: new Date(),
          },
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": commentId }] // Ensure we update the correct comment inside the array
      }
    );
    if (!review) {
      return res.status(404).json({ message: "Comment not found or unauthorized access." });
    }

    res.status(200).json({ message: "Comment edited successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to edit comment.", error: error.message });
  }
};


exports.addRating = async (req, res) => {
  try {
    const { bookId, userId, rating } = req.body;

    if (!bookId || !userId || rating == null) {
      return res.status(400).json({ message: "Book ID, User ID, and rating are required." });
    }

    // Find the review for the given bookId
    const review = await Review.findOne({ bookId });

    if (!review) {
      return res.status(404).json({ message: "Book not found for the rating." });
    }

    // Check if the user has already rated the book
    const existingRating = review.ratings.find(r => r.userId.toString() === userId.toString());

    if (existingRating) {
      // If the user has rated, update the rating
      existingRating.rating = rating;
      existingRating.timestamp = new Date();
    } else {
      // If the user hasn't rated, add a new rating
      review.ratings.push({ userId, rating, timestamp: new Date() });
    }

    // Save the updated review
    await review.save();

    // Recalculate the average rating
    const allRatings = review.ratings.map(r => r.rating);
    const averageRating = allRatings.length > 0
      ? allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length
      : 0;

    // Update the book's average rating
    await Book.findByIdAndUpdate(bookId, { averageRating });

    res.status(200).json({ message: "Rating added/updated successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to add rating.", error: error.message });
  }
};

// Add a tweet
exports.addTweet = async (req, res) => {
  try {
    const { bookId, userId, tweet } = req.body;

    if (!bookId || !userId || !tweet) {
      return res.status(400).json({ message: "Book ID, User ID, and tweet are required." });
    }

    const review = await Review.findOneAndUpdate(
      { bookId },
      { $push: { tweets: { userId, tweet, timestamp: new Date() } } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate("bookId", "title");
    // console.log("add tweet",review);
    const recent_tweet=review?.tweets.at(-1);
    console.log("recent_tweet",recent_tweet);
    const bookName=review.bookId.title;
    
    const tweet_added={
      user:recent_tweet.userId,
      bookId,
      tweet:recent_tweet.tweet,
      date:recent_tweet.timestamp,
      bookName
    }
    console.log("tweet_added",tweet_added);
    res.status(200).json({ message: "Tweet added successfully.", tweet_added });
  } catch (error) {
    res.status(500).json({ message: "Failed to add tweet.", error: error.message });
  }
};
// fetch all tweets
exports.alltweets=async (req, res) => {
  try {
    const reviews = await Review.find().populate("bookId", "title");
    // console.log("reviews",reviews[0].tweets[0]);
    const tweets = reviews.flatMap((review) =>
      review.tweets.map((tweet) => ({
        tweet: tweet.tweet,
        date: tweet.timestamp,
        user: tweet.userId,
        bookId: review.bookId._id,
        bookName: review.bookId.title,
      }))
    );

    const books = reviews.map((review) => ({
      bookId: review.bookId._id,
      bookName: review.bookId.title,
    }));
    console.log("all tweets",{tweets,books});
    res.json({ tweets, books });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get reviews for a book
exports.getReviewsByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;

    const review = await Review.findOne({ bookId }).populate("bookId", "title author");
    if (!review) {
      return res.status(404).json({ message: "No reviews found for this book." });
    }

    res.status(200).json({ message: "Reviews retrieved successfully.", review });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve reviews.", error: error.message });
  }
};


// Add a rating
// exports.addRating = async (req, res) => {
//   try {
//     const { bookId, userId, rating } = req.body;

//     if (!bookId || !userId || rating == null) {
//       return res.status(400).json({ message: "Book ID, User ID, and rating are required." });
//     }

//     // const review = await Review.findOneAndUpdate(
//     //   { bookId },
//     //   { $push: { ratings: { userId, value: rating, timestamp: new Date() } } },
//     //   { upsert: true, new: true, setDefaultsOnInsert: true }
//     // );
//     const review = await Review.findOneAndUpdate(
//         { bookId },
//         { $push: { ratings: { userId, rating, timestamp: new Date() } } },  // Use 'rating' instead of 'value'
//         { upsert: true, new: true, setDefaultsOnInsert: true }
//       );
//     // Recalculate average rating
//     // const allRatings = review.ratings.map(r => r.value);
//     // const averageRating = allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length;
//     const allRatings = review.ratings.map(r => r.rating);  // Make sure to use 'rating' here
//     const averageRating = allRatings.length > 0
//       ? allRatings.reduce((sum, value) => sum + value, 0) / allRatings.length
//       : 0;
//     // Update the book's average rating
//     await Book.findByIdAndUpdate(bookId, { averageRating });

//     res.status(200).json({ message: "Rating added successfully.", review });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to add rating.", error: error.message });
//   }
// };