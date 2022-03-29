const ObjectId = require("mongoose").Types.ObjectId;
const { Article } = require("../models/article");
const User = require("../models/user");

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
    const users = await User.find({}).sort({ username: "desc" });

    res.send(users).status(200);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
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
