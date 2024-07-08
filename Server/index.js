const express = require("express");
const urlRoute = require("./routes/url");
const connect = require("./connection");
const URL = require("./models/urlmodal");
const app = express();
const PORT = 8001;
connect("mongodb://localhost:27017/shorturl")
  .then(() => console.log("connected to DBMS"))
  .catch((err) => console.log(err));
app.use(express.json());
app.use("/", urlRoute);

app.listen(PORT, () => console.log(`server Running at PORT ${PORT}`));
