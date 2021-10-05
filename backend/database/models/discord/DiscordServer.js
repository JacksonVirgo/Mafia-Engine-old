const mongoose = require('mongooose');
const Schema = mongoose.Schema;

const DiscordServerSchema = new Schema({
    guildID: {
        type: String,
        required: true,
    },
    logChannel: {
        type: String,
        required: false,
    },
    signups: {
        type: [String],
        default: [],
    },
});

module.exports = mongoose.model('discord-servers', DiscordServerSchema);
