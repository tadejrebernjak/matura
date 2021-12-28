var mongoose = require("mongoose");

var ReplySchema = new mongoose.Schema({
  userID: mongoose.SchemaTypes.ObjectId,
  username: String,
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [],
  dislikes: [],
});

var CommentSchema = new mongoose.Schema({
  userID: mongoose.SchemaTypes.ObjectId,
  username: String,
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [],
  dislikes: [],
  replies: [ReplySchema],
});

var ArticleSchema = new mongoose.Schema({
  source: String,
  url: { type: String, unique: true },
  title: String,
  date: String,
  time: String,
  timestamp: Date,
  summary: String,
  category: String,
  image: String,
  comments: [CommentSchema],
  likes: [],
  dislikes: [],
});

// Export the model
module.exports = mongoose.model("Comment", CommentSchema);
module.exports = mongoose.model("Reply", ReplySchema);
module.exports = mongoose.model("Article", ArticleSchema);
