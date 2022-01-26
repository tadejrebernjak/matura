let { Article, Comment } = require("../models/article");
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

    for (i = 0; i < article.comments.length; i++) {
      let user = await User.findOne({ _id: article.comments[i].userID });

      article.comments[i].user = {
        username: user.username,
        pfp: user.pfp || null,
      };

      //delete article.comments[i].userID;
    }
    res.send(article);
  } catch (error) {
    res.send(error);
  }
};

exports.addArticleComment = async function (req, res) {
  try {
    /*const article = await Article.findOne({ _id: req.params.id });
    for (i = 0; i < article.comments.length; i++) {
      if (article.comments[i].userID.equals(req.user._id)) {
        return res.status(400).send("User already commented");
      }
    }*/

    const comment = new Comment({
      userID: req.user._id,
      body: req.body.comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: [],
      dislikes: [],
      replies: [],
    });

    await Article.updateOne(
      { _id: req.params.id },
      { $push: { comments: comment } }
    );

    res.status(201).send("Comment created");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.deleteArticleComment = async function (req, res) {
  try {
    await Article.updateOne(
      { _id: req.params.articleID },
      {
        $pull: { comments: { _id: req.params.commentID, userID: req.user.id } },
      }
    );
    res.status(200).send("Deleted comment");
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
