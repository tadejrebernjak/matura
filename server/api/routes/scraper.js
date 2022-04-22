var express = require("express");
var router = express.Router();

var scraper_controller = require("../controllers/scraper");

router.get("/24ur", async (req, res) => {
  let articles = await scraper_controller.scrape24ur();

  scraper_controller.insertArticles(articles);

  res.send(articles);
});

router.get("/delo", async (req, res) => {
  let articles = await scraper_controller.scrapeDelo();

  scraper_controller.insertArticles(articles);

  res.send(articles);
});

router.get("/siol", async (req, res) => {
  let articles = await scraper_controller.scrapeSiol();

  scraper_controller.insertArticles(articles);

  res.send(articles);
});

router.get("/slovenskenovice", async (req, res) => {
  let articles = await scraper_controller.scrapeSlovenskeNovice();

  scraper_controller.insertArticles(articles);

  res.send(articles);
});

router.get("/dnevnik", async (req, res) => {
  let articles = await scraper_controller.scrapeDnevnik();
  res.send(articles);
});

router.get("/all", async (req, res) => {
  let stirindvajstur = await scraper_controller.scrape24ur();
  let delo = await scraper_controller.scrapeDelo();
  let siol = await scraper_controller.scrapeSiol();
  let slovenskenovice = await scraper_controller.scrapeSlovenskeNovice();

  let articles = [...stirindvajstur, ...delo, ...siol, ...slovenskenovice];

  articles.sort((a, b) => b.timestamp - a.timestamp);

  scraper_controller.insertArticles(articles);

  res.send(articles);
});

router.post("/", async (req, res) => {
  let stirindvajstur = await scraper_controller.scrape24ur();
  let delo = await scraper_controller.scrapeDelo();
  let siol = await scraper_controller.scrapeSiol();
  let slovenskenovice = await scraper_controller.scrapeSlovenskeNovice();

  let articles = [...stirindvajstur, ...delo, ...siol, ...slovenskenovice];

  articles.sort((a, b) => b.timestamp - a.timestamp);

  scraper_controller.insertArticles(articles);

  res.sendStatus(200);
});

module.exports = router;
