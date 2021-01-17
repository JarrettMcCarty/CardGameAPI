const db = require("../models");
const User = db.user;
const Utils = require('../../utility.js');

exports.post = (req, res) => {
    if (req.body['username'] == undefined ||  req.body['password'] == undefined) {
        res.json({
          "status": "error",
          "details": "Missing required fields."
        });
        return;
      }
    
      const username = req.body['username'].toLowerCase();
      const password = req.body['password'];
    
      const user = await User.findOne({ username: username });
      if (user) {
        res.json({
          "status": "error",
          "details": "That username is already taken."
        });
        return;
      }
    
      let salt = Utils.generateSalt();
    
      let newUser = new User({
        username: username,
        passHash: Utils.hashPassword(password, salt),
        salt: salt
      });
      newUser.save().then(item => {
        res.json({"status": "success"});
      }).catch(err => {
        console.log('\nDatabase ERROR - ' + new Date(Date.now()).toLocaleString())
        console.log(err)
        res.json({
          "status": "error",
          "details": "There was an error saving to the database."
        });
      });
};