import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },

    releaseDate: {
        type: String,
    },
    genre: {
        type: String,
    },
    duration: {
        type: Number // duration in minutes
    },
    posterUrl: {
        type: String
    },
    trailerUrl: {
        type: String
    },
    movieFileUrl: {
        type: String
    },
    status: {
        type: String,
        enum: ['inprogress', 'ready', 'error', 'inactive'],
        default: 'inprogress'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;
