const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");
const { setUser } = require("../service/auth");

async function handleUserSignup(req, res) {
  const { name, email, password } = req.body;
  const USER = await User.create({
    name,
    email,
    password,
  });
  console.log(USER);
  return res.redirect("/");
}
async function handleUserLogin(req, res) {
  const { email, password } = req.body;
  const USER = await User.findOne({ email, password });
  if (!USER) {
    res.render("login", {
      error: "Invalid Username or password",
    });
  }
  const sessionId = uuidv4();
  setUser(sessionId, USER);
  res.cookie("uid", sessionId);
  return res.redirect("/");
}

module.exports = { handleUserSignup, handleUserLogin };
