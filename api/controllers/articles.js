let Article = require("../models/article");

exports.getArticles = async function () {
  try {
    let articles = await Article.find({}).sort({ timestamp: -1 }).limit(20);
    return articles;
  } catch (error) {
    console.log(error);
  }
};
