let { Article, Comment } = require("../models/article");

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

exports.editArticleComment = async function (req, res) {
  try {
    const newComment = req.body.newComment.trim();
    if (newComment === "") {
      return res.status(400).send("Comment is empty");
    }

    await Article.updateOne(
      {
        _id: req.params.articleID,
      },
      {
        $set: {
          "comments.$[comment].body": newComment,
          "comments.$[comment].updatedAt": Date.now(),
        },
      },
      {
        arrayFilters: [
          {
            "comment.userID": req.user._id,
            "comment._id": req.params.commentID,
          },
        ],
      }
    );
    res.status(200).send("Comment updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.deleteArticleComment = async function (req, res) {
  try {
    if (req.user.isAdmin) {
      await Article.updateOne(
        { _id: req.params.articleID },
        {
          $pull: { comments: { _id: req.params.commentID } },
        }
      );
    } else {
      await Article.updateOne(
        { _id: req.params.articleID },
        {
          $pull: {
            comments: { _id: req.params.commentID, userID: req.user.id },
          },
        }
      );
    }
    res.status(200).send("Deleted comment");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.rateArticleComment = async function (req, res) {
  try {
    let state = "";

    const article = await Article.findOne({
      _id: req.params.articleID,
    });

    for (i = 0; i < article.comments.length; i++) {
      if (article.comments[i]._id == req.params.commentID) {
        if (article.comments[i].likes.includes(req.user._id)) {
          state = "liked";
        }
        if (article.comments[i].dislikes.includes(req.user._id)) {
          state = "disliked";
        }
      }
    }

    switch (req.body.action) {
      case "like":
        switch (state) {
          case "liked":
            await unlikeComment(
              article._id,
              req.params.commentID,
              req.user._id
            );
            break;
          case "disliked":
            await undislikeComment(
              article._id,
              req.params.commentID,
              req.user._id
            );
            await likeComment(article._id, req.params.commentID, req.user._id);
            break;
          case "":
            await likeComment(article._id, req.params.commentID, req.user._id);
            break;
          default:
            break;
        }
        break;
      case "dislike":
        switch (state) {
          case "liked":
            await unlikeComment(
              article._id,
              req.params.commentID,
              req.user._id
            );
            await dislikeComment(
              article._id,
              req.params.commentID,
              req.user._id
            );
            break;
          case "disliked":
            await undislikeComment(
              article._id,
              req.params.commentID,
              req.user._id
            );
            break;
          case "":
            await dislikeComment(
              article._id,
              req.params.commentID,
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

async function likeComment(articleID, commentID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $push: {
        "comments.$[comment].likes": userID,
      },
    },
    {
      arrayFilters: [
        {
          "comment._id": commentID,
        },
      ],
    }
  );
}

async function unlikeComment(articleID, commentID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $pullAll: {
        "comments.$[comment].likes": [userID],
      },
    },
    {
      arrayFilters: [
        {
          "comment._id": commentID,
        },
      ],
    }
  );
}

async function dislikeComment(articleID, commentID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $push: {
        "comments.$[comment].dislikes": userID,
      },
    },
    {
      arrayFilters: [
        {
          "comment._id": commentID,
        },
      ],
    }
  );
}

async function undislikeComment(articleID, commentID, userID) {
  await Article.updateOne(
    {
      _id: articleID,
    },
    {
      $pullAll: {
        "comments.$[comment].dislikes": [userID],
      },
    },
    {
      arrayFilters: [
        {
          "comment._id": commentID,
        },
      ],
    }
  );
}
