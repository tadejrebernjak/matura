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

router.get(
  "/users",
  users_controller.authenticateToken,
  admin_controller.getUsers
);

router.get(
  "/user/:id",
  users_controller.authenticateToken,
  admin_controller.getUserById
);

router.get(
  "/users/search/:query",
  users_controller.authenticateToken,
  admin_controller.searchUsers
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

router.delete(
  "/users/:userID",
  users_controller.authenticateToken,
  admin_controller.deleteUser
);

router.put(
  "/user",
  users_controller.authenticateToken,
  admin_controller.updateUser
);

router.post(
  "/user/mute",
  users_controller.authenticateToken,
  admin_controller.muteUser
);

router.post(
  "/user/unmute",
  users_controller.authenticateToken,
  admin_controller.unmuteUser
);

module.exports = router;
