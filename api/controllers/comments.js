let { Article, Comment } = require("../models/article");

exports.addArticleComment = async function (req, res) {
  if (new Date(req.user.muteExpiration) > new Date()) {
    return res.sendStatus(403);
  }

  try {
    const comment = new Comment({
      user: req.user._id,
      article: req.params.id,
      body: req.body.comment,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: [],
      dislikes: [],
      replies: [],
    });

    await comment.save();

    await Article.updateOne(
      { _id: req.params.id },
      { $push: { comments: comment._id } }
    );

    res.status(201).send("Comment created");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.editArticleComment = async function (req, res) {
  if (new Date(req.user.muteExpiration) > new Date()) {
    return res.sendStatus(403);
  }

  try {
    const newComment = req.body.newComment.trim();
    if (newComment === "") {
      return res.status(400).send("Comment is empty");
    }

    const update = {
      body: newComment,
      updatedAt: Date.now(),
    };

    await Comment.updateOne({ _id: req.params.commentID }, update);

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
          $pull: { comments: [req.params.commentID] },
        }
      );

      await Comment.deleteOne({ _id: req.params.commentID });
      res.status(200).send("Deleted comment");
    } else {
      const result = await Comment.deleteOne({
        _id: req.params.commentID,
        user: req.user.id,
      });

      if (result.deletedCount > 0) {
        await Article.updateOne(
          { _id: req.params.articleID },
          {
            $pull: {
              comments: [req.params.commentID],
            },
          }
        );
        res.status(200).send("Deleted comment");
      } else {
        res.status(500).send("Something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.rateArticleComment = async function (req, res) {
  try {
    let state = "";

    const comment = await Comment.findOne({
      _id: req.params.commentID,
    });

    if (comment.likes.includes(req.user._id)) {
      state = "liked";
    }
    if (comment.dislikes.includes(req.user._id)) {
      state = "disliked";
    }

    switch (req.body.action) {
      case "like":
        switch (state) {
          case "liked":
            await unlikeComment(req.params.commentID, req.user._id);
            break;
          case "disliked":
            await undislikeComment(req.params.commentID, req.user._id);
            await likeComment(req.params.commentID, req.user._id);
            break;
          case "":
            await likeComment(req.params.commentID, req.user._id);
            break;
          default:
            break;
        }
        break;
      case "dislike":
        switch (state) {
          case "liked":
            await unlikeComment(req.params.commentID, req.user._id);
            await dislikeComment(req.params.commentID, req.user._id);
            break;
          case "disliked":
            await undislikeComment(req.params.commentID, req.user._id);
            break;
          case "":
            await dislikeComment(req.params.commentID, req.user._id);
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

async function likeComment(commentID, userID) {
  await Comment.updateOne(
    {
      _id: commentID,
    },
    {
      $push: {
        likes: userID,
      },
    }
  );
}

async function unlikeComment(commentID, userID) {
  await Comment.updateOne(
    {
      _id: commentID,
    },
    {
      $pullAll: {
        likes: [userID],
      },
    }
  );
}

async function dislikeComment(commentID, userID) {
  await Comment.updateOne(
    {
      _id: commentID,
    },
    {
      $push: {
        dislikes: userID,
      },
    }
  );
}

async function undislikeComment(commentID, userID) {
  await Comment.updateOne(
    {
      _id: commentID,
    },
    {
      $pullAll: {
        dislikes: [userID],
      },
    }
  );
}
