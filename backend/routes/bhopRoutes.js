const express = require("express");

const {
  signup, login,
} = require("../controllers/BhopSignupController");

const router = express.Router({
  mergeParams: true,
});

router.post("/:client/signupbhop", signup);
router.post("/:client/loginbhop", login);

module.exports = router;