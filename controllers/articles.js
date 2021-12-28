let Article = require("../models/article");

exports.getArticles = async function () {
  try {
    let articles = await Article.find({}).sort({ timestamp: -1 });
    return articles;
  } catch (error) {
    console.log(error);
  }
};
