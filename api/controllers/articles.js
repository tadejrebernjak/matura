let { Article, Comment, Reply, Rating, Visit } = require("../models/article");
let User = require("../models/user");

exports.getArticles = async function (req, res) {
  try {
    let articles;

    if (req.params.category == "sport") {
      const categories = ["sport", "sportal", "Sportal"];

      articles = await Article.find({
        category: { $in: categories },
        hidden: false,
      }).sort({
        timestamp: -1,
      });
    } else if (req.params.category == "chronicle") {
      const categories = ["kronika", "crna-kronika", "Črna kronika", "Kronika"];

      articles = await Article.find({
        category: { $in: categories },
        hidden: false,
      }).sort({
        timestamp: -1,
      });
    } else {
      articles = await Article.find({ hidden: false }).sort({ timestamp: -1 });
    }

    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.searchArticles = async function (req, res) {
  const query = req.params.query;

  try {
    let articles;

    if (req.params.category == "sport") {
      const categories = ["sport", "sportal", "Sportal"];

      articles = await Article.find({
        title: { $regex: query, $options: "i" },
        category: { $in: categories },
        hidden: false,
      }).sort({ timestamp: -1 });
    } else if (req.params.category == "chronicle") {
      const categories = ["kronika", "crna-kronika", "Črna kronika", "Kronika"];

      articles = await Article.find({
        title: { $regex: query, $options: "i" },
        category: { $in: categories },
        hidden: false,
      }).sort({ timestamp: -1 });
    } else {
      articles = await Article.find({
        title: { $regex: query, $options: "i" },
        hidden: false,
      }).sort({ timestamp: -1 });
    }

    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.getReadArticles = async function (req, res) {
  try {
    let articles = await Article.find({
      "clicks.userID": req.user._id,
      hidden: false,
    });
    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.getLikedArticles = async function (req, res) {
  try {
    let articles = await Article.find({
      "likes.userID": req.user._id,
      hidden: false,
    });
    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.getTodayArticles = async function (req, res) {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      1,
      0,
      0
    );

    let articles = await Article.find({
      timestamp: { $gte: startOfToday },
      hidden: false,
    }).sort({ timestamp: -1 });

    res.send(articles);
  } catch (error) {
    console.log(error);
  }
};

exports.getArticleById = async function (req, res) {
  try {
    const article = await Article.findOne({ _id: req.params.id }).lean().exec();
    const comments = await Comment.find({ article: req.params.id })
      .populate("user")
      .populate({
        path: "replies",
        populate: { path: "user" },
      });

    res.send({ article: article, comments: comments });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.visitArticle = async function (req, res) {
  try {
    const article = await Article.findOne({ _id: req.params.id });

    const click = new Visit({
      userID: req.user._id,
      createdAt: Date.now(),
    });

    if (
      !article.clicks.some(function (click) {
        return click.userID.equals(req.user._id);
      })
    ) {
      await Article.updateOne(
        { _id: req.params.id },
        { $push: { clicks: click } }
      );
      res.status(200).send("Added visit");
    } else {
      res.status(200).send("Already visited");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.rateArticle = async function (req, res) {
  try {
    const article = await Article.findOne({ _id: req.params.id });
    let state;

    const liked = article.likes.some(function (like) {
      return like.userID.equals(req.user._id);
    });
    const disliked = article.dislikes.some(function (dislike) {
      return dislike.userID.equals(req.user._id);
    });

    if (liked) state = "liked";
    else if (disliked) state = "disliked";
    else state = "";

    switch (req.body.action) {
      case "like":
        switch (state) {
          case "liked":
            await unlikeArticle(article._id, req.user._id);
            break;
          case "disliked":
            await undislikeArticle(article._id, req.user._id);
            await likeArticle(article._id, req.user._id);
            break;
          case "":
            await likeArticle(article._id, req.user._id);
            break;
          default:
            break;
        }
        break;
      case "dislike":
        switch (state) {
          case "liked":
            await unlikeArticle(article._id, req.user._id);
            await dislikeArticle(article._id, req.user._id);
            break;
          case "disliked":
            await undislikeArticle(article._id, req.user._id);
            break;
          case "":
            await dislikeArticle(article._id, req.user._id);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
    res.status(200).send("ok");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

async function likeArticle(articleID, userID) {
  const like = new Rating({
    userID: userID,
    createdAt: Date.now(),
  });
  await Article.updateOne({ _id: articleID }, { $push: { likes: like } });
}

async function unlikeArticle(articleID, userID) {
  await Article.updateOne(
    { _id: articleID },
    { $pull: { likes: { userID: userID } } },
    { new: true }
  );
}

async function dislikeArticle(articleID, userID) {
  const dislike = new Rating({
    userID: userID,
    createdAt: Date.now(),
  });

  await Article.updateOne({ _id: articleID }, { $push: { dislikes: dislike } });
}

async function undislikeArticle(articleID, userID) {
  await Article.updateOne(
    { _id: articleID },
    { $pull: { dislikes: { userID: userID } } },
    { new: true }
  );
}
