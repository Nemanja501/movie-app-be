const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    watchlist: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ],
    watched: [
        {
            movie: {
                type: Schema.Types.ObjectId,
                ref: 'Movie'
            },
            rating: Number
        }
    ]
});

module.exports = mongoose.model('User', userSchema);