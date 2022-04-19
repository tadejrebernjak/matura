var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  username: String,
  password: String,
  pfp: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  muteExpiration: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: () => Date.now(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

// Export the model
module.exports = mongoose.model("User", UserSchema);
