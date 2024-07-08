const shortid = require("shortid");
const URL = require("../models/urlmodal");

async function handleNewShortURLGenerator(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortId = shortid();
  await URL.create({
    shortID: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.json({ id: shortId });
}
async function handleAnalytics(req, res) {
  const Id = req.params.shortId;
  const result = await URL.findOne({ Id });
  return res.json({
    // TotalClicks: result.visitHistory,
    Analytics: result.visitHistory,
  });
}
async function handleRedirectURL(req, res) {
  const shortId = req.params.shortId;

  try {
    // Find the URL entry and update its visit history
    const entry = await URL.findOneAndUpdate(
      { shortID: shortId },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    // If entry is found, redirect to the original URL
    if (entry && entry.redirectURL) {
      console.log("Redirecting to:", entry.redirectURL);
      res.redirect("https://" + entry.redirectURL);
    } else {
      // Handle case where entry is not found or redirectURL is not defined
      console.log(
        `URL with shortId '${shortId}' not found or missing redirectURL`
      );
      res.status(404).send("URL not found");
    }
  } catch (error) {
    console.error("Error handling redirect:", error);
    res.status(500).send("Server Error");
  }
}
module.exports = {
  handleNewShortURLGenerator,
  handleRedirectURL,
  handleAnalytics,
};
