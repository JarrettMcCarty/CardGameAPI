const db = require("../models");
const User = db.user;
const Utils = require('../../utility.js');

exports.post = async (req, res) => {
    if (req.body['username'] == undefined ||  req.body['password'] == undefined) {
        res.status(400).json({
          "status": "error",
          "details": "Missing required fields."
        });
        return;
      }
    
      const username = req.body['username'].toLowerCase();
      const password = req.body['password'];
      const avatar = req.body['avatar'];
      const background = req.body['background'];
      const deck = req.body['deck'];
      const drawmode = req.body['drawmode'];
      const difficulty = req.body['difficulty'];

      const user = await User.findOne({ username: username });
      if (user) {
        res.status(400).json({
          "status": "error",
          "details": "That username is already taken."
        });
        return;
      }
    
      let salt = Utils.generateSalt();
    
      let newUser = new User({
        username: username,
        passwordHash: Utils.hashPassword(password, salt),
        salt: salt,
        avatar: avatar,
        background: background,
        deck: deck
      });
      newUser.save().then(item => {
        res.json({"status": "success"});
      }).catch(err => {
        console.log('\nDatabase ERROR - ' + new Date(Date.now()).toLocaleString())
        console.log(err)
        res.status(500).json({
          "status": "error",
          "details": "There was an error saving to the database."
        });
      });
};