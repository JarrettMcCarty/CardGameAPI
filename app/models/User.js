const { Int32 } = require("bson");
const { Binary } = require("bson");

module.exports = mongoose => {
  const UserSchema = mongoose.Schema(
    {
      username: {type: String, unique: true},
      passwordHash: String,
      salt: String,
      avatar: String,
      background: String,
      deck: String
    },
    { timestamps: true }
  );

  UserSchema.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("User", UserSchema);
  return User;
};
