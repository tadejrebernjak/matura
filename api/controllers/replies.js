let { Article, Reply } = require("../models/article");

exports.addArticleCommentReply = async function (req, res) {
  try {
    const replyBody = req.body.reply.trim();

    if (replyBody === "") {
      return res.status(400).send("Reply is empty");
    }

    const reply = new Reply({
      userID: req.user._id,
      body: replyBody,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: [],
      dislikes: [],
    });

    await Article.updateOne(
      {
        _id: req.params.articleID,
        "comments._id": req.params.commentID,
      },
      {
        $push: {
          "comments.$.replies": reply,
        },
      }
    );
    res.status(200).send("Reply added");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.editArticleCommentReply = async function (req, res) {
  try {
    const newReply = req.body.newReply.trim();
    if (newReply === "") {
      return res.status(400).send("Reply is empty");
    }

    await Article.updateOne(
      {
        _id: req.params.articleID,
      },
      {
        $set: {
          "comments.$[comment].replies.$[reply].body": newReply,
          "comments.$[comment].replies.$[reply].updatedAt": Date.now(),
        },
      },
      {
        arrayFilters: [
          { "comment._id": req.params.commentID },
          { "reply.userID": req.user._id, "reply._id": req.params.replyID },
        ],
      }
    );
    res.status(200).send("Comment updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.deleteArticleCommentReply = async function (req, res) {
  try {
    await Article.updateOne(
      { _id: req.params.articleID, "comments._id": req.params.commentID },
      {
        $pull: {
          "comments.$.replies": {
            _id: req.params.replyID,
            userID: req.user.id,
          },
        },
      }
    );
    res.status(200).send("Deleted reply");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.rateArticleCommentReply = async function (req, res) {
  try {
    let state = "";

    const article = await Article.findOne({
      _id: req.params.articleID,
    });

    for (i = 0; i < article.comments.length; i++) {
      if (article.comments[i]._id == req.params.commentID) {
        for (y = 0; y < article.comments[i].replies.length; y++) {
          if (article.comments[i].replies[y]._id == req.params.replyID) {
            if (article.comments[i].replies[y].likes.includes(req.user._id)) {
              state = "liked";
            }
            if (
              article.comments[i].replies[y].dislikes.includes(req.user._id)
            ) {
              state = "disliked";
            }
          }
        }
      }
    }

    switch (req.body.action) {
      case "like":
        switch (state) {
          case "liked":
            await unlikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            break;
          case "disliked":
            await undislikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            await likeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            break;
          case "":
            await likeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            break;
          default:
            break;
        }
        break;
      case "dislike":
        switch (state) {
          case "liked":
            await unlikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            await dislikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            break;
          case "disliked":
            await undislikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
            break;
          case "":
            await dislikeReply(
              article._id,
              req.params.commentID,
              req.params.replyID,
              req.user._id
            );
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

async function likeReply(articleID, commentID, replyID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $push: {
        "comments.$[comment].replies.$[reply].likes": userID,
      },
    },
    {
      arrayFilters: [{ "comment._id": commentID }, { "reply._id": replyID }],
    }
  );
}

async function unlikeReply(articleID, commentID, replyID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $pullAll: {
        "comments.$[comment].replies.$[reply].likes": [userID],
      },
    },
    {
      arrayFilters: [{ "comment._id": commentID }, { "reply._id": replyID }],
    }
  );
}

async function dislikeReply(articleID, commentID, replyID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $push: {
        "comments.$[comment].replies.$[reply].dislikes": userID,
      },
    },
    {
      arrayFilters: [{ "comment._id": commentID }, { "reply._id": replyID }],
    }
  );
}

async function undislikeReply(articleID, commentID, replyID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $pullAll: {
        "comments.$[comment].replies.$[reply].dislikes": [userID],
      },
    },
    {
      arrayFilters: [{ "comment._id": commentID }, { "reply._id": replyID }],
    }
  );
}
