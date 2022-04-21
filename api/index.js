require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const cron = require("node-cron");

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to db"));

const scraperRouter = require("./routes/scraper");
const articlesRouter = require("./routes/articles");
const usersRouter = require("./routes/users");
const adminRouter = require("./routes/admin");

const port = 5000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

app.use("/scraper", scraperRouter);
app.use("/articles", articlesRouter);
app.use("/users", usersRouter);
app.use("/admin", adminRouter);

cron.schedule("*/10 * * * *", async () => {
  try {
    await axios.post(`http://localhost:${port}/scraper`);
  } catch (error) {
    console.log(error);
  }
});

app.listen(port, () =>
  console.log(`Server listening on http://localhost:${port}`)
);
