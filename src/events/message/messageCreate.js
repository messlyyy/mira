const { getPrefix } = require('../../utils/prefix');

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    const prefix = getPrefix(message.guild.id);
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
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
