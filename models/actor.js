const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const actorSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    movies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Movie'
        }
    ]
});

module.exports = mongoose.model('Actor', actorSchema);