const router = require("express").Router();

const RecaptchaController = require("../controllers/RecaptchaController");

//create
router.post("/recaptcha", RecaptchaController.validRecaptcha);

module.exports = router;
