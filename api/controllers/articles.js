let Article = require("../models/article");

exports.getArticles = async function () {
  try {
    let articles = await Article.find({}).sort({ timestamp: -1 }).limit(20);
    return articles;
  } catch (error) {
    console.log(error);
  }
};

exports.getArticleById = async function (req, res) {
  try {
    let article = await Article.find({ _id: req.params.id });
    res.send(article[0]);
  } catch (error) {
    res.send(error);
  }
};
