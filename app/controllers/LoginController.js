const db = require("../models");
const User = db.user;
const Utils = require('../../utility.js');

// 
exports.post = async (req, res) => {
  if (req.body['username'] == undefined || req.body['password'] == undefined) {
    res.status(400).json({
      "status": "error",
      "details": "Missing required fields"
    });
    return; 
  }

  const username = req.body['username'].toLowerCase();
  const password = req.body['password'];
  const user = await User.findOne({ username: username }).exec();
  if (!user) {
    res.status(400).json({
      "status": "error",
      "details": "Invalid username"
    });
    return; 
  }

  if (Utils.hashPassword(password, user.salt) != user.passwordHash) {
    res.status(400).json({
      "status": "error",
      "details": "Invalid password"
    });
    return; 
  }
  else {
    res.json({
      "username": user.username,
      "avatar": user.avatar,
      "background": user.background,
      "drawmode": user.drawmode,
      "difficulty": user.difficulty,
      "deck": user.deck
    })
  }
};

