let { Comment, Reply } = require("../models/article");

exports.addArticleCommentReply = async function (req, res) {
  if (new Date(req.user.muteExpiration) > new Date()) {
    return res.sendStatus(403);
  }

  try {
    const replyBody = req.body.reply.trim();

    if (replyBody === "") {
      return res.status(400).send("Reply is empty");
    }

    const reply = new Reply({
      user: req.user._id,
      comment: req.params.comentID,
      body: replyBody,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      likes: [],
      dislikes: [],
    });

    await reply.save();

    await Comment.updateOne(
      {
        _id: req.params.commentID,
      },
      {
        $push: {
          replies: reply._id,
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
  if (new Date(req.user.muteExpiration) > new Date()) {
    return res.sendStatus(403);
  }

  try {
    const newReply = req.body.newReply.trim();
    if (newReply === "") {
      return res.status(400).send("Reply is empty");
    }

    const update = {
      body: newReply,
      updatedAt: Date.now(),
    };

    await Reply.updateOne({ _id: req.params.replyID }, update);

    res.status(200).send("Reply updated");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.deleteArticleCommentReply = async function (req, res) {
  try {
    if (req.user.isAdmin) {
      await Comment.updateOne(
        { _id: req.params.commentID },
        {
          $pull: {
            replies: [req.params.replyID],
          },
        }
      );

      await Reply.deleteOne({ _id: req.params.replyID });
      res.status(200).send("Deleted reply");
    } else {
      const result = await Reply.deleteOne({
        _id: req.params.ReplyID,
        user: req.user.id,
      });

      if (result.deletedCount > 0) {
        await Comment.updateOne(
          { _id: req.params.comentID },
          {
            $pull: {
              replies: [req.params.replyID],
            },
          }
        );
        res.status(200).send("Deleted reply");
      } else {
        res.status(500).send("Something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

exports.rateArticleCommentReply = async function (req, res) {
  try {
    let state = "";

    const reply = await Reply.findOne({
      _id: req.params.replyID,
    });

    if (reply.likes.includes(req.user._id)) {
      state = "liked";
    }
    if (reply.dislikes.includes(req.user._id)) {
      state = "disliked";
    }

    switch (req.body.action) {
      case "like":
        switch (state) {
          case "liked":
            await unlikeReply(req.params.replyID, req.user._id);
            break;
          case "disliked":
            await undislikeReply(req.params.replyID, req.user._id);
            await likeReply(req.params.replyID, req.user._id);
            break;
          case "":
            await likeReply(req.params.replyID, req.user._id);
            break;
          default:
            break;
        }
        break;
      case "dislike":
        switch (state) {
          case "liked":
            await unlikeReply(req.params.replyID, req.user._id);
            await dislikeReply(req.params.replyID, req.user._id);
            break;
          case "disliked":
            await undislikeReply(req.params.replyID, req.user._id);
            break;
          case "":
            await dislikeReply(req.params.replyID, req.user._id);
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

async function likeReply(replyID, userID) {
  await Reply.updateOne(
    {
      _id: replyID,
    },
    {
      $push: {
        likes: userID,
      },
    }
  );
}

async function unlikeReply(replyID, userID) {
  await Reply.updateOne(
    {
      _id: replyID,
    },
    {
      $pullAll: {
        likes: [userID],
      },
    }
  );
}

async function dislikeReply(replyID, userID) {
  await Reply.updateOne(
    {
      _id: replyID,
    },
    {
      $push: {
        dislikes: userID,
      },
    }
  );
}

async function undislikeReply(replyID, userID) {
  await ReplyID.updateOne(
    {
      _id: replyID,
    },
    {
      $pullAll: {
        dislikes: [userID],
      },
    }
  );
}
