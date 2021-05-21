module.exports = mongoose => {
    const PlayerSchema = mongoose.Schema(
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            displayName: String,
            isReady: Boolean,
            hand: [Number],
            cardCount: Number,
            playedCard: Number
        },
        { timestamps: true }
    );

    PlayerSchema.method("toJSON", function() {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
      });

    const Player = mongoose.model("Player", PlayerSchema);
    return Player;
};