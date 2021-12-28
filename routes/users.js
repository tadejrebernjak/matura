var express = require("express");
var router = express.Router();

var users_controller = require("../controllers/users");

router.get("/", users_controller.getUsers);

router.get("/:id", users_controller.getUserById);

router.post("/create", users_controller.createUser);

router.delete("/:id/delete", users_controller.deleteUser);

/*router.put('/:id/update', scraper_controller.product_update);

router.delete('/:id/delete', scraper_controller.product_delete);*/

module.exports = router;
