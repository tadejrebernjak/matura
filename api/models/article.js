var mongoose = require("mongoose");

var ReplySchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  username: String,
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [],
  dislikes: [],
});

var CommentSchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
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
  clicks: [],
});

const Comment = mongoose.model("Comment", CommentSchema);
const Reply = mongoose.model("Reply", ReplySchema);
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = {
  Comment: Comment,
  Reply: Reply,
  Article: Article,
};
