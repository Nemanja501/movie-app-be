const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    movieId: {
        type: Schema.Types.ObjectId,
        ref: 'Movie',
        required: true
    }
}, {timestamps: true});

module.exports = mongoose.model('Review', reviewSchema);