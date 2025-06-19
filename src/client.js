const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

client.slashCommands = new Collection();
client.prefixCommands = new Collection();

// Load handlers
require('./handlers/eventHandler')(client);
require('./handlers/commandHandler')(client);
require('./handlers/prefixHandler')(client);

client.login(process.env.DISCORD_TOKEN);
module.exports = client;
