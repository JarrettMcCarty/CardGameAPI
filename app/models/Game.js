module.exports = mongoose => {
    const GameSchema = mongoose.Schema(
        {
            deck: [Number], 
            table: [Number],
            bid: Number,
            biddingPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' }, 
            suit: Number, 
            ledSuit: Number,
            suitName: String,
            activePlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Player' },
            activePlayerIndex: Number,
            team1Score: Number,
            team2Score: Number,
            team1PointsInRound: Number,
            team2PointsInRound: Number, 
            isActive: Boolean,
            handsSet: Boolean
        },
        { timestamps: true }
    );

    GameSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Game = mongoose.model("Game", GameSchema);
    return Game;
};