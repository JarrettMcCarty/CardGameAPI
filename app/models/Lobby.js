// add all lobby members avatars to array (future state)
module.exports = mongoose => {
    const LobbySchema = mongoose.Schema(
        {
            short_id: { type: String, unique: true },
            lobbyName: String,
            lobbyJoin: Number, /* 0 == Private Lobby, 1 == Public lobby, no id needed to join */
            lobbyStatus: String,
            dealer: Number,
            isPrivate: Boolean,
            users: [String],
            activeGame: { type: mongoose.Schema.Types.ObjectId, ref: 'Game' },
            games: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }],
            team1: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            team2: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
            numPlayers: Number
        },
        { timestamps: true }
    );

    LobbySchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Lobby = mongoose.model("Lobby", LobbySchema);
    return Lobby;
};