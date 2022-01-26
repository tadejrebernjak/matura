const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (_req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 200000000, // 2 MB
  },
  fileFilter: function (_req, file, cb) {
    checkFileType(file, cb);
  },
});

function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images only!");
  }
}

var users_controller = require("../controllers/users");

router.get("/", users_controller.getUsers);

router.get("/:id", users_controller.getUserById);

router.post("/token", users_controller.authorizeToken);

router.post("/create", users_controller.createUser);

router.post("/login", users_controller.authenticateUser);

router.post(
  "/pfp",
  users_controller.authenticateToken,
  upload.single("file"),
  users_controller.updatePfp
);

router.delete("/:id/delete", users_controller.deleteUser);

router.put(
  "/update",
  users_controller.authenticateToken,
  users_controller.updateUser
);

module.exports = router;
