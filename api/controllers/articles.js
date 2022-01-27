let { Article, Comment, Reply } = require("../models/article");
let User = require("../models/user");

exports.getArticles = async function () {
  try {
    let articles = await Article.find({}).sort({ timestamp: -1 }).limit(30);
    return articles;
  } catch (error) {
    console.log(error);
  }
};

exports.getArticleById = async function (req, res) {
  try {
    let article = await Article.findOne({ _id: req.params.id }).lean().exec();

    // Adds user information to comments
    for (i = 0; i < article.comments.length; i++) {
      let user = await User.findOne({ _id: article.comments[i].userID });

      article.comments[i].user = {
        username: user.username,
        pfp: user.pfp || null,
      };

      // Adds user information to replies
      for (y = 0; y < article.comments[i].replies.length; y++) {
        let user2 = await User.findOne({
          _id: article.comments[i].replies[y].userID,
        });

        article.comments[i].replies[y].user = {
          username: user2.username,
          pfp: user2.pfp || null,
        };
      }
    }
    res.send(article);
  } catch (error) {
    res.send(error);
  }
};

exports.visitArticle = async function (req, res) {
  try {
    const article = await Article.findOne({ _id: req.params.id });
    if (!article.clicks.includes(req.user._id)) {
      await Article.updateOne(
        { _id: req.params.id },
        { $push: { clicks: req.user._id } }
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

    const liked = article.likes.includes(req.user._id);
    const disliked = article.dislikes.includes(req.user._id);

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
  await Article.updateOne({ _id: articleID }, { $push: { likes: userID } });
}

async function unlikeArticle(articleID, userID) {
  await Article.updateOne(
    { _id: articleID },
    { $pullAll: { likes: [userID] } }
  );
}

async function dislikeArticle(articleID, userID) {
  await Article.updateOne({ _id: articleID }, { $push: { dislikes: userID } });
}

async function undislikeArticle(articleID, userID) {
  await Article.updateOne(
    { _id: articleID },
    { $pullAll: { dislikes: [userID] } }
  );
}
