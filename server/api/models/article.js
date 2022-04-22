var mongoose = require("mongoose");

var ReplySchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  comment: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Comment",
  },
  username: String,
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [],
  dislikes: [],
});

var CommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  article: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article",
  },
  body: String,
  createdAt: Date,
  updatedAt: Date,
  likes: [],
  dislikes: [],
  replies: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Reply" }],
});

var EntrySchema = new mongoose.Schema({
  userID: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User",
  },
  createdAt: Date,
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
  hidden: {
    type: Boolean,
    default: false,
  },
  comments: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Comment" }],
  likes: [EntrySchema],
  dislikes: [EntrySchema],
  clicks: [EntrySchema],
});

const Comment = mongoose.model("Comment", CommentSchema);
const Reply = mongoose.model("Reply", ReplySchema);
const Visit = mongoose.model("Visit", EntrySchema);
const Rating = mongoose.model("Rating", EntrySchema);
const Article = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = {
  Comment: Comment,
  Reply: Reply,
  Visit: Visit,
  Rating: Rating,
  Article: Article,
};
