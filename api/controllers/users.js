let User = require("../models/user");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { next } = require("cheerio/lib/api/traversing");

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

exports.updateUser = async function (req, res) {};

exports.authenticateUser = async function (req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    return res.status(400).send("Napačna E-Pošta ali geslo");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      const userTokenData = {
        _id: user._id,
        email: user.email,
        username: user.username,
        pfp: user.pfp,
      };

      const accessToken = jwt.sign(
        userTokenData,
        process.env.ACCESS_TOKEN_SECRET
      );

      res.status(200).json({ accessToken: accessToken });
    } else {
      res.status(400).send("Napačna E-Pošta ali geslo");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Napaka v strežniku");
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

exports.authorizeToken = function (req, res) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userTokenData) => {
    if (err) {
      return res.sendStatus(403);
    }

    res.status(200).send(userTokenData);
  });
};

exports.authenticateToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userTokenData) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = userTokenData;

    next();
  });
};
