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
        res.status(400).send("Account with this email already exists.");
      } else {
        user.save();
        res.status(201).send("Account successfully registered!");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

exports.authenticateUser = async function (req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    return res.status(400).send();
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send("Success");
    } else {
      res.status(400).send();
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
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
