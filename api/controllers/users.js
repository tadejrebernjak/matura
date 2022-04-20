let User = require("../models/user");

require("dotenv").config();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { next } = require("cheerio/lib/api/traversing");
const fs = require("fs");

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

exports.updateUser = async function (req, res) {
  const update = {
    email: req.body.email,
    username: req.body.username,
  };

  try {
    if (await bcrypt.compare(req.body.password, req.user.password)) {
      if (req.user.email != req.body.email) {
        User.countDocuments(
          { email: req.body.email },
          async function (err, count) {
            if (count > 0) {
              error = true;
              return res.status(400).send("E-Pošta je že uporabljena");
            } else {
              try {
                await User.findOneAndUpdate({ _id: req.user._id }, update);

                const newUser = await User.findOne({ _id: req.user._id });
                signToken(res, newUser);
              } catch (error) {
                console.log(error);
                res.status(500).send("Napaka v strežniku");
              }
            }
          }
        );
      } else {
        try {
          await User.findOneAndUpdate({ _id: req.user._id }, update);

          const newUser = await User.findOne({ _id: req.user._id });
          signToken(res, newUser);
        } catch (error) {
          console.log(error);
          res.status(500).send("Napaka v strežniku");
        }
      }
    } else {
      return res.status(400).send("Napačno geslo");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Napaka v strežniku");
  }
};

exports.updatePfp = async function (req, res) {
  try {
    if (req.user.pfp) {
      let pathSplit = req.user.pfp.split("/");
      let fileDeletePath = "./" + pathSplit[3] + "/" + pathSplit[4];
      fs.unlinkSync(fileDeletePath);
    }
  } catch (error) {
    console.log(error);
  }

  const filePath = req.file.path.replace(/\\/g, "/");

  const update = {
    pfp: "http://localhost:5000/" + filePath,
  };

  try {
    await User.findOneAndUpdate({ _id: req.user._id }, update);

    const newUser = await User.findOne({ _id: req.user._id });
    signToken(res, newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send("Napaka v strežniku");
  }
};

exports.authenticateUser = async function (req, res) {
  const user = await User.findOne({ email: req.body.email });
  if (user == null) {
    return res.status(400).send("Napačna E-Pošta ali geslo");
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      signToken(res, user);
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

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, userTokenData) => {
      if (err) {
        return res.sendStatus(403);
      }

      try {
        req.user = await User.findOne({ _id: userTokenData._id });
      } catch (err) {
        return res.sendStatus(403);
      }
      next();
    }
  );
};

function signToken(res, user) {
  const userTokenData = {
    _id: user._id,
    email: user.email,
    username: user.username,
    pfp: user.pfp,
    isAdmin: user.isAdmin,
    muteExpiration: user.muteExpiration,
  };

  const accessToken = jwt.sign(userTokenData, process.env.ACCESS_TOKEN_SECRET);

  res.status(200).json({ accessToken: accessToken });
}
