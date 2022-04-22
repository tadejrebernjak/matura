require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const cron = require("node-cron");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to db"));

const scraperRouter = require("./api/routes/scraper");
const articlesRouter = require("./api/routes/articles");
const usersRouter = require("./api/routes/users");
const adminRouter = require("./api/routes/admin");
const scraper_controller = require("./api/controllers/scraper");

const port = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));

app.use("/api/scraper", scraperRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/users", usersRouter);
app.use("/api/admin", adminRouter);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(__dirname + "/public"));

  app.get(/.*/, (req, res) => res.sendFile(__dirname + "/public/index.html"));
}

cron.schedule("*/5 * * * *", async () => {
  try {
    let stirindvajstur = await scraper_controller.scrape24ur();
    let delo = await scraper_controller.scrapeDelo();
    let siol = await scraper_controller.scrapeSiol();
    let slovenskenovice = await scraper_controller.scrapeSlovenskeNovice();

    let articles = [...stirindvajstur, ...delo, ...siol, ...slovenskenovice];

    articles.sort((a, b) => b.timestamp - a.timestamp);

    scraper_controller.insertArticles(articles);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
