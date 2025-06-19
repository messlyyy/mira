const { getPrefix } = require('../../utils/prefix');
const fs = require('fs');
const path = require('path');

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    // Obtener los JSON
    const guilds = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/guilds.json')));
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/users.json')));

    // Determinar el prefix
    const serverPrefix = guilds[message.guild.id]?.prefix || '!';
    const userPrefix = users[message.author.id]?.selfPrefix;

    const prefixesToCheck = userPrefix ? [userPrefix, serverPrefix] : [serverPrefix];

    let usedPrefix = null;

    for (const p of prefixesToCheck) {
        if (message.content.startsWith(p)) {
            usedPrefix = p;
            break;
        }
    }

    if (!usedPrefix) return;

    const args = message.content.slice(usedPrefix.length).trim().split(/ +/);
    const cmdName = args.shift().toLowerCase();
    const command = client.prefixCommands.get(cmdName);

    if (command) {
        try {
            await command.execute(client, message, args);
        } catch (err) {
            console.error(err);
            message.reply('❌ Oops! Error executing command.');
        }
    }
};
