module.exports = app => {
  const login = require("../controllers/LoginController.js");
  const register = require("../controllers/RegisterController.js");

  var router = require("express").Router();

  // Login
  router.post("/login", login.post);
  // Register
  router.post("/register", register.post);


  app.use("/api/pitchonline", router);
};
