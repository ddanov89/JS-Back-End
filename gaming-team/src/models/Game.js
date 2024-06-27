const { Schema, model, Types } = require('mongoose');

const gameSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    genre: {
        type: String,
        required: true,
    },
    platform: {
        type: String,
        enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
        required: true,
    },
    boughtBy: {
        type: [Types.ObjectId],
        required: true,
        default: []
    },
    author: {
        type: Types.ObjectId,
        ref: 'User'
    }
});

const Game = model('Game', gameSchema);

module.exports = { Game };