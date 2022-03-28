let { Article } = require("../models/article");

const axios = require("axios");
const cheerio = require("cheerio");

const settings = {
  providers: [
    {
      name: "24ur",
      url: "https://www.24ur.com/sveze",
      baseUrl: "https://www.24ur.com",
    },
    {
      name: "delo",
      url: "https://www.delo.si/zadnje/",
      baseUrl: "https://www.delo.si",
    },
    {
      name: "siol",
      url: "https://siol.net/pregled-dneva/",
      baseUrl: "https://siol.net",
    },
    {
      name: "slovenskeNovice",
      url: "https://www.slovenskenovice.si/zadnje/",
      baseUrl: "https://www.slovenskenovice.si",
    },
  ],
};

exports.scrape24ur = async function () {
  const provider = settings.providers.find(
    (provider) => provider.name === "24ur"
  );
  try {
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $(".timeline");

    $(".timeline__item", timeline).each(function () {
      const source = "24ur";
      const url = provider.baseUrl + $(this).attr("href");
      const title = $(this).find(".card__title-inside").text().trim();
      let date = $(this).find(".timeline__date").text().trim();
      let time = $(this).find(".timeline__time").text().trim();
      date = date.replace(/\s+/g, "");
      date = formatDate(date);
      time = time.split(" ").pop();
      const timestamp = getTimestamp(date, time);
      const summary = $(this).find(".card__summary").text().trim();
      const category = extractUrlCategory(url, 3);
      const image = $(this).find("img").attr("src");

      const article = new Article({
        source: source,
        url: url,
        title: title,
        date: date,
        time: time,
        timestamp: timestamp,
        summary: summary,
        category: category,
        image: image,
      });

      articles.push(article);
    });
    return articles;
  } catch (error) {
    console.log(error);
  }
};

exports.scrapeDelo = async function () {
  const provider = settings.providers.find(
    (provider) => provider.name === "delo"
  );
  try {
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $(".timeline");

    $(".paginator_item", timeline).each(function () {
      const source = "Delo";
      let url = $(this)
        .find(".article_teaser_timeline__title_link")
        .attr("href");
      if (extractHostname(url) == "") {
        url = provider.baseUrl + url;
      }
      const title = $(this)
        .find(".article_teaser_timeline__title_text")
        .text()
        .trim();
      let date = $(this)
        .find(".article_teaser_timeline__date_holder")
        .text()
        .trim();
      date = formatDate(date);
      let time = $(this)
        .find(".article_teaser_timeline__time_holder")
        .text()
        .trim();
      time = formatHours(time);
      const timestamp = getTimestamp(date, time);
      const summary = $(this)
        .find(".article_teaser_timeline__subtitle_text")
        .text()
        .trim();
      const category = extractUrlCategory(url, 3);

      const article = new Article({
        source: source,
        url: url,
        title: title,
        date: date,
        time: time,
        timestamp: timestamp,
        summary: summary,
        category: category,
      });

      articles.push(article);
    });

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const articleResponse = await axios(article.url);
      const $ = cheerio.load(articleResponse.data);
      const image =
        (await "https://") +
        extractHostname(article.url) +
        $(".article__img_tag").attr("src");
      article.image = image;
    }
    return articles;
  } catch (error) {
    console.log(error);
  }
};

exports.scrapeSiol = async function () {
  const provider = settings.providers.find(
    (provider) => provider.name === "siol"
  );
  try {
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $(".timemachine__article_list");

    $(".timemachine__article_item", timeline).each(function () {
      const source = "Siol";
      const url = provider.baseUrl + $(this).find(".card__link").attr("href");
      const title = $(this).find(".card__title").text().trim();
      const today = new Date();
      let date =
        today.getDate() +
        "." +
        (today.getMonth() + 1) +
        "." +
        today.getFullYear();
      date = formatDate(date);
      let time = $(this).find(".card__time").text().trim();
      time = formatHours(time);
      const timestamp = getTimestamp(date, time);
      const summary = $(this).find(".card__description").text().trim();
      const category = extractUrlCategory(url, 4);

      const article = new Article({
        source: source,
        url: url,
        title: title,
        date: date,
        time: time,
        timestamp: timestamp,
        summary: summary,
        category: category,
      });

      articles.push(article);
    });

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const articleResponse = await axios(article.url);
      const $ = cheerio.load(articleResponse.data);
      const image =
        (await provider.baseUrl) +
        $(".article__figure").find("img").attr("src");
      article.image = image;
    }

    return articles;
  } catch (error) {
    console.log(error);
  }
};

exports.scrapeSlovenskeNovice = async function () {
  const provider = settings.providers.find(
    (provider) => provider.name === "slovenskeNovice"
  );
  try {
    const articlesResponse = await axios(provider.url);
    var $ = cheerio.load(articlesResponse.data);
    const articles = [];
    const timeline = await $(".timeline__section");

    $(".paginator_item", timeline).each(function () {
      let url = $(this)
        .find(".article_teaser_timeline__title_link")
        .attr("href");
      if (extractHostname(url) == "") {
        url = provider.baseUrl + url;

        const source = "Slovenske Novice";
        const title = $(this)
          .find(".article_teaser_timeline__title_text")
          .text()
          .trim();
        const summary = $(this)
          .find(".article_teaser_timeline__subtitle_text")
          .text()
          .trim();
        let date = $(this)
          .find(".article_teaser_timeline__date_holder")
          .text()
          .trim();
        date = formatDate(date);
        let time = $(this)
          .find(".article_teaser_timeline__time_holder")
          .text()
          .trim();
        time = formatHours(time);
        const timestamp = getTimestamp(date, time);
        const category = extractUrlCategory(url, 3);

        const article = new Article({
          source: source,
          url: url,
          title: title,
          date: date,
          time: time,
          timestamp: timestamp,
          summary: summary,
          category: category,
        });

        articles.push(article);
      }
    });

    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      const articleResponse = await axios(article.url);
      const $ = cheerio.load(articleResponse.data);
      const image =
        (await provider.baseUrl) + $(".article__img_tag").attr("src");
      article.image = image;
    }
    return articles;
  } catch (error) {
    console.log(error);
  }
};

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
    hostname = url.split("/")[2];
  } else {
    hostname = url.split("/")[0];
  }

  //find & remove port number
  hostname = hostname.split(":")[0];
  //find & remove "?"
  hostname = hostname.split("?")[0];

  return hostname;
}

function extractUrlCategory(url, index) {
  var category;

  category = url.split("/");

  if (category[3] == "sportal") return "sport";

  return category[index];
}

function formatHours(timeString) {
  const timeSplit = timeString.split(":");

  let hours = timeSplit[0];
  const minutes = timeSplit[1];

  if (hours < 10 && hours.length > 1) {
    hours = hours[1];
  }

  const newTime = hours + ":" + minutes;
  return newTime;
}

function formatDate(dateString) {
  const dateSplit = dateString.split(".");

  let day = dateSplit[0];
  let month = dateSplit[1];

  if (day < 10 && day.length > 1) {
    day = day[1];
  }
  if (month < 10 && month.length > 1) {
    month = month[1];
  }

  const newDate = day + "." + month + "." + dateSplit[2];
  return newDate;
}

function getTimestamp(date, time) {
  const dateSplit = date.split(".");

  const day = parseInt(dateSplit[0]);
  let month = parseInt(dateSplit[1]);
  month--;
  const year = parseInt(dateSplit[2]);

  const timeSplit = time.split(":");

  let hours = parseInt(timeSplit[0]);
  hours++;
  const minutes = parseInt(timeSplit[1]);

  const dateObject = new Date(year, month, day, hours, minutes, 0);
  return dateObject;
}

exports.insertArticles = async function (articles) {
  try {
    articles.forEach((article) => {
      Article.countDocuments({ url: article.url }, function (err, count) {
        if (count === 0) {
          article.save(function (error) {
            if (error) {
              console.log(error);
            }
          });
        }
      });
    });
    console.log("Successfully updated articles in database");
  } catch (error) {
    console.log(error);
  }
};
