const fs = require('fs');
const path = require('path');
const guildsPath = path.join(__dirname, '../../../data/guilds.json');
let guilds = require(guildsPath);

module.exports = {
    name: 'setprefix',
    description: 'Sets a custom prefix for this server.',
    async execute(client, message, args) {
        if (!message.member.permissions.has('Administrator')) {
            return message.reply('❌ You need to be an administrator to use this command.');
        }

        const newPrefix = args[0];
        if (!newPrefix) {
            return message.reply('❌ Please provide a new prefix.');
        }

        const guildId = message.guild.id;
        guilds[guildId] = { prefix: newPrefix.trim() };
        fs.writeFileSync(guildsPath, JSON.stringify(guilds, null, 2));

        message.reply(`✅ Server prefix has been set to \`${newPrefix}\`.`);
    }
};
