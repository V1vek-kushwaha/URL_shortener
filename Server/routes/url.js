const express = require("express");
const {
  handleNewShortURLGenerator,
  handleRedirectURL,
  handleAnalytics,
} = require("../controllers/url");
const router = express.Router();

router.post("/url", handleNewShortURLGenerator);
router.get("/analytics/:shortId", handleAnalytics);
router.get("/:shortId", handleRedirectURL);

module.exports = router;
