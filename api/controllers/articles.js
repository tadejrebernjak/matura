let Article = require("../models/article");

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
    let article = await Article.find({ _id: req.params.id });
    res.send(article[0]);
  } catch (error) {
    res.send(error);
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
    res.status(200);
  } catch (error) {
    console.log(error);
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
