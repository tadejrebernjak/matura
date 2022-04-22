const express = require("express");
const router = express.Router();

var users_controller = require("../controllers/users");

router.get("/", users_controller.getUsers);

router.get("/:id", users_controller.getUserById);

router.post("/token", users_controller.authorizeToken);

router.post("/create", users_controller.createUser);

router.post("/login", users_controller.authenticateUser);

router.delete("/:id/delete", users_controller.deleteUser);

router.put(
  "/update",
  users_controller.authenticateToken,
  users_controller.updateUser
);

module.exports = router;
