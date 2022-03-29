const express = require("express");
const router = express.Router();

const users_controller = require("../controllers/users");
const admin_controller = require("../controllers/admin");

router.get(
  "/articles",
  users_controller.authenticateToken,
  admin_controller.getArticles
);

router.get(
  "/articles/find/:category",
  users_controller.authenticateToken,
  admin_controller.getArticles
);

router.get(
  "/articles/search/:query/:category",
  users_controller.authenticateToken,
  admin_controller.searchArticles
);

router.post(
  "/articles/toggleVisibility/:articleID",
  users_controller.authenticateToken,
  admin_controller.toggleVisibility
);

router.delete(
  "/articles/:articleID",
  users_controller.authenticateToken,
  admin_controller.deleteArticle
);

module.exports = router;
