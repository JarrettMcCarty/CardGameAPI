const { mongoose } = require(".");

module.exports = mongoose => {
    const TeamSchema = mongoose.Schema(
        {
            name: String,
            score: Number,
            player1: { type: mongoose.Schema.Types.ObjectId, ref: 'Player'},
            player2: { type: mongoose.Schema.Types.ObjectId, ref: 'Player'}
        },
        { timestamps: true }
    );

    TeamSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Team = mongoose.model("Team", TeamSchema);
    return Team;
}