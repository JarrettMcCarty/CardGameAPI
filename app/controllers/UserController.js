const db = require("../models");
const User = db.user;
const Utils = require('../../utility.js');

exports.update = async (req, res) => {
    const username = req.body['username'].toLowerCase();
    const user = await User.findOne({ username: username }).exec();
    if (!user) {
        res.status(400).json({
        "status": "error",
        "details": "This user does not exist"
        });
        return; 
    }
    const id = user.id;      
    let newpass = user.passwordHash;
    let newsalt = user.salt;
    // check here if password matches, if not treat as new password and update password as well
    if (Utils.hashPassword(req.body["password"], user.salt) != user.passwordHash) {
      newsalt = Utils.generateSalt();
      newpass =  Utils.hashPassword(req.body["password"], newsalt);
    }
      const update = 
      {
        passwordHash: newpass,
        salt: newsalt,
        avatar: req.body["avatar"], 
        background: req.body["background"],
        deck:  req.body["deck"]
      };
    User.findByIdAndUpdate(id, update, { useFindAndModify: false })
    .then(data => {
        if (!data) {
          res.status(404).json({
            "status": "error",
            "details": "Cannot update User Settings with id=${id}. Maybe the User was not found!"
          });
        } else res.json({ "status": "success", "details": "User Settings were updated successfully." });
      })
      .catch(err => {
        res.status(500).json({
          "status": "error",
          "details": "Error updating User with id=" + id
        });
      });
}