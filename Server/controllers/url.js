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
    createdBy: req.user._id,
  });
  return res.render("home", { id: shortId });
  // return res.json({ id: shortId });
}
async function handleAnalytics(req, res) {
  const shortID = req.params.shortId;
  console.log("Received shortId:", shortID); // Log the received shortId

  try {
    const result = await URL.findOne({ shortID });
    console.log("Query result:", result); // Log the result from MongoDB query

    if (!result) {
      return res.status(404).json({ error: "Analytics data not found" });
    }

    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
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
      // console.log("Redirecting to:", entry.redirectURL);
      // res.redirect("https://" + entry.redirectURL);
      res.redirect(entry.redirectURL);
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
