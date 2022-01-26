var express = require("express");
var router = express.Router();

var articles_controller = require("../controllers/articles");
var users_controller = require("../controllers/users");

router.get("/", async (req, res) => {
  let articles = await articles_controller.getArticles();

  res.send(articles);
});

router.get("/:id", articles_controller.getArticleById);

router.post(
  "/:id/rate",
  users_controller.authenticateToken,
  articles_controller.rateArticle
);

router.post(
  "/:id/comments",
  users_controller.authenticateToken,
  articles_controller.addArticleComment
);

router.delete(
  "/:articleID/comments/:commentID",
  users_controller.authenticateToken,
  articles_controller.deleteArticleComment
);

/*router.get('/:id', scraper_controller.product_details);

router.put('/:id/update', scraper_controller.product_update);

router.delete('/:id/delete', scraper_controller.product_delete);*/

module.exports = router;
