const db = require("../models");
const User = db.user;
const Utils = require('../../utility.js');

// 
exports.post = async (req, res) => {
  if (req.body['Username'] == undefined || req.body['Password'] == undefined) {
    res.json({
      "status": "error",
      "details": "Missing required fields"
    });
    return; 
  }

  const username = req.body['Username'].toLowerCase();
  const password = req.body['Password'];
  const user = await User.findOne({ username: username }).exec();
  if (!user) {
    res.json({
      "status": "error",
      "details": "Invalid username"
    });
    return; 
  }

  if (Utils.hashPassword(password, user.salt) != user.passHash) {
    res.json({
      "status": "error",
      "details": "Invalid password"
    });
    return; 
  }
  else {
    res.json({
      "status": "success", 
      "username": user.username,
      "avatar": user.avatar
    })
  }
};

