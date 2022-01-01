var express = require("express");
var router = express.Router();

var articles_controller = require("../controllers/articles");

router.get("/", async (req, res) => {
  let articles = await articles_controller.getArticles();

  res.send(articles);
});

router.get("/:id", articles_controller.getArticleById);

/*router.post('/create', scraper_controller.product_create);

router.get('/:id', scraper_controller.product_details);

router.put('/:id/update', scraper_controller.product_update);

router.delete('/:id/delete', scraper_controller.product_delete);*/

module.exports = router;
