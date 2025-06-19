const guilds = require('../../../data/guilds.json');
const selfprefix = require('../../../data/selfprefix.json');

module.exports = {
    name: 'prefix',
    description: 'Shows the current prefix for this server and your personal prefix.',
    async execute(client, message, args) {
        const guildId = message.guild.id;
        const userId = message.author.id;

        const guildPrefix = guilds[guildId]?.prefix || ',';
        const userPrefix = selfprefix[userId]?.prefix || 'None';

        message.reply(
            `🔧 **Server Prefix:** \`${guildPrefix}\`\n👤 **Your Personal Prefix:** \`${userPrefix}\``
        );
    }
};
