const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    posterUrl: {
        type: String,
        required: true
    },
    director: {
        type: Schema.Types.ObjectId,
        ref: 'Director'
    },
    cast: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Actor'
        }
    ],
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    ratings: [
        {
            type: Number
        }
    ],
    averageRating: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model('Movie', movieSchema);