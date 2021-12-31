let User = require("../models/user");

const bcrypt = require("bcrypt");

exports.getUsers = async function (req, res) {
  try {
    let users = await User.find({});
    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

exports.getUserById = async function (req, res) {
  try {
    let user = await User.find({ _id: req.params.id });
    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

exports.createUser = async function (req, res) {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
    });

    User.countDocuments({ email: user.email }, function (err, count) {
      if (count > 0) {
        res.send("Account with this email already exists.");
      } else {
        user.save();
        res.send("Account successfully registered!");
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async function (req, res) {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.send("Account successfully removed");
  } catch (error) {
    console.log(error);
  }
};
