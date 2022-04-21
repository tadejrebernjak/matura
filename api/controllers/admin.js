const ObjectId = require("mongoose").Types.ObjectId;
const { Article } = require("../models/article");
const User = require("../models/user");
const fs = require("fs");
const { findByIdAndUpdate } = require("../models/user");

exports.toggleVisibility = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    const article = await Article.findOne({ _id: req.params.articleID });

    const update = {
      hidden: !article.hidden,
    };

    await Article.findOneAndUpdate({ _id: req.params.articleID }, update);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.getArticles = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    let articles;

    if (req.params.category == "sport") {
      const categories = ["sport", "sportal", "Sportal"];

      articles = await Article.find({
        category: { $in: categories },
      }).sort({
        timestamp: -1,
      });
    } else if (req.params.category == "chronicle") {
      const categories = ["kronika", "crna-kronika", "Črna kronika", "Kronika"];

      articles = await Article.find({
        category: { $in: categories },
      }).sort({
        timestamp: -1,
      });
    } else {
      articles = await Article.find({}).sort({ timestamp: -1 });
    }

    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.searchArticles = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const query = req.params.query;

  try {
    let articles;

    if (req.params.category == "sport") {
      const categories = ["sport", "sportal", "Sportal"];

      articles = await Article.find({
        title: { $regex: query, $options: "i" },
        category: { $in: categories },
      }).sort({ timestamp: -1 });
    } else if (req.params.category == "chronicle") {
      const categories = ["kronika", "crna-kronika", "Črna kronika", "Kronika"];

      articles = await Article.find({
        title: { $regex: query, $options: "i" },
        category: { $in: categories },
      }).sort({ timestamp: -1 });
    } else {
      articles = await Article.find({
        title: { $regex: query, $options: "i" },
      }).sort({ timestamp: -1 });
    }

    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteArticle = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    await Article.deleteOne({ _id: req.params.articleID });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.getUsers = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    const users = await User.find({
      $or: [{ isAdmin: false }, { isAdmin: null }],
    }).sort({
      username: "desc",
    });

    res.send(users).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.getUserById = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    const user = await User.findOne({ _id: req.params.id });

    if (user) {
      res.send(user).status(200);
    } else {
      res.status(404).send("Ne najdem uporabnika");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.searchUsers = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const query = req.params.query;
  const objID = new ObjectId(query.length < 12 ? "123456789012" : query);

  try {
    const users = await User.find({
      $and: [
        {
          $or: [
            {
              _id: objID,
            },
            {
              username: { $regex: query, $options: "i" },
            },
            {
              email: { $regex: query, $options: "i" },
            },
          ],
        },
        { $or: [{ isAdmin: false }, { isAdmin: null }] },
      ],
    }).sort({ username: "desc" });

    res.send(users);
  } catch (error) {
    console.log(error);
  }
};

exports.deleteUser = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  try {
    await User.deleteOne({ _id: req.params.userID });
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.updateUser = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const oldUser = await User.findOne({ _id: req.body.user._id });
  if (!oldUser) {
    return res.sendStatus(404);
  }

  const update = {
    email: req.body.user.email,
    username: req.body.user.username,
  };

  if (update.email != oldUser.email) {
    User.countDocuments({ email: update.email }, async function (err, count) {
      if (count > 0) {
        error = true;
        return res.status(400).send("Account with this email already exists.");
      } else {
        try {
          await User.findOneAndUpdate({ _id: req.user._id }, update);

          return res.sendStatus(200);
        } catch (error) {
          console.log(error);
        }
      }
    });
  } else {
    try {
      await User.findOneAndUpdate({ _id: req.body.user._id }, update);

      return res.sendStatus(200);
    } catch (error) {
      console.log(error);
    }
  }
};

exports.removePfp = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const user = await User.findOne({ _id: req.params.userID });

  if (!user) {
    return res.sendStatus(404);
  }

  try {
    const pathSplit = user.pfp.split("/");
    const fileDeletePath = "./" + pathSplit[3] + "/" + pathSplit[4];
    fs.unlinkSync(fileDeletePath);
  } catch (error) {
    console.log(error);
  }

  try {
    await User.updateOne({ _id: req.params.userID }, { pfp: null });
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.muteUser = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const muteDate = new Date();
  muteDate.setDate(muteDate.getDate() + req.body.muteDays);

  const update = {
    muteExpiration: muteDate,
  };

  try {
    await User.updateOne({ _id: req.body.userID }, update);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

exports.unmuteUser = async function (req, res) {
  if (!req.user.isAdmin) {
    return res.sendStatus(403);
  }

  const update = {
    muteExpiration: null,
  };

  try {
    await User.updateOne({ _id: req.body.userID }, update);
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
