module.exports = app => {
  const login = require("../controllers/LoginController.js");
  const register = require("../controllers/RegisterController.js");
  const user = require("../controllers/UserController.js");
  const lobby = require("../controllers/LobbyController.js");
  const team = require("../controller/TeamController.js");
  var router = require("express").Router();

  // Login
  router.post("/login", login.post);
  // Register
  router.post("/register", register.post);
  // User Settings update
  router.post("/user/settings", user.update);
  // Create a lobby, fetch a lobby by it's id and create a new game through the lobby
  router.post("/lobby/create", lobby.create);
  router.post("/lobby/newGame", lobby.newGame);
  router.get("/lobby/all", lobby.getAll);
  router.get("/lobby/join", lobby.join);
  router.get("/lobby/removeuser", lobby.removeruser);
  //router.get("/lobby/:Id", lobby.getById);
  

  app.use("/api/pitchonline", router);
};
