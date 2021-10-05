const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    emoji: {
        type: String,
        required: true,
    },
    locked: {
        type: Boolean,
        default: false,
    },
    max: {
        type: Number,
        default: -1,
    },
    users: {
        type: [String],
        default: [],
    },
    bannedUsers: {
        type: [String],
        default: [],
    },
});

const SignupSchema = new mongoose.Schema({
    channel: {
        type: String,
        required: true,
    },
    post: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: false,
        default: 'Game Signups',
    },
    locked: {
        type: Boolean,
        default: false,
    },
    categories: {
        type: [CategorySchema],
        default: [],
    },
    bannedUsers: {
        type: [String],
        default: [],
    },
});

module.exports = mongoose.model('discord-signups', SignupSchema);
