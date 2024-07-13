const express = require("express");
const urlRoute = require("./routes/url");
const staticRoutes = require("./routes/staticRouter");
const connectDBMS = require("./connection");
const app = express();
const path = require("path");
const PORT = 8001;
connectDBMS("mongodb://localhost:27017/shorturl")
  .then(() => console.log("connected to DBMS"))
  .catch((err) => console.log(err));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoutes);

app.listen(PORT, () => console.log(`server Running at PORT ${PORT}`));
