const express = require("express");
const router = express.Router();

const articles_controller = require("../controllers/articles");
const comments_controller = require("../controllers/comments");
const replies_controller = require("../controllers/replies");
const users_controller = require("../controllers/users");

// ARTICLES

router.get("/find/:category", articles_controller.getArticles);

router.get("/search/:query/:category", articles_controller.searchArticles);

router.get(
  "/read",
  users_controller.authenticateToken,
  articles_controller.getReadArticles
);

router.get(
  "/liked",
  users_controller.authenticateToken,
  articles_controller.getLikedArticles
);

router.get("/today", articles_controller.getTodayArticles);

router.get("/:id", articles_controller.getArticleById);

router.post(
  "/:id/rate",
  users_controller.authenticateToken,
  articles_controller.rateArticle
);

router.post(
  "/:id/visit",
  users_controller.authenticateToken,
  articles_controller.visitArticle
);

// ARTICLE COMMENTS

router.post(
  "/:id/comments",
  users_controller.authenticateToken,
  comments_controller.addArticleComment
);

router.post(
  "/:articleID/comments/:commentID/rate",
  users_controller.authenticateToken,
  comments_controller.rateArticleComment
);

router.put(
  "/:articleID/comments/:commentID",
  users_controller.authenticateToken,
  comments_controller.editArticleComment
);

router.delete(
  "/:articleID/comments/:commentID",
  users_controller.authenticateToken,
  comments_controller.deleteArticleComment
);

// ARTICLE COMMENTS REPLIES

router.post(
  "/:articleID/comments/:commentID/replies",
  users_controller.authenticateToken,
  replies_controller.addArticleCommentReply
);

router.post(
  "/:articleID/comments/:commentID/replies/:replyID/rate",
  users_controller.authenticateToken,
  replies_controller.rateArticleCommentReply
);

router.put(
  "/:articleID/comments/:commentID/replies/:replyID",
  users_controller.authenticateToken,
  replies_controller.editArticleCommentReply
);

router.delete(
  "/:articleID/comments/:commentID/replies/:replyID",
  users_controller.authenticateToken,
  replies_controller.deleteArticleCommentReply
);

/*router.get('/:id', scraper_controller.product_details);

router.put('/:id/update', scraper_controller.product_update);

router.delete('/:id/delete', scraper_controller.product_delete);*/

module.exports = router;
