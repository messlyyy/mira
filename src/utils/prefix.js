const defaultPrefix = '!';
const config = require('../data/guilds.json');

function getPrefix(guildId) {
    return config[guildId]?.prefix || defaultPrefix;
}

module.exports = { getPrefix };
