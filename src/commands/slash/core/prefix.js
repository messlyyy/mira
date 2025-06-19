const { SlashCommandBuilder } = require('discord.js');
const guilds = require('../../../data/guilds.json');
const selfprefix = require('../../../data/selfprefix.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Shows the current prefix for this server and your personal prefix.'),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const userId = interaction.user.id;

        const guildPrefix = guilds[guildId]?.prefix || ',';
        const userPrefix = selfprefix[userId]?.prefix || 'None';

        await interaction.reply({
            content: `🔧 **Server Prefix:** \`${guildPrefix}\`\n👤 **Your Personal Prefix:** \`${userPrefix}\``,
            ephemeral: true
        });
    }
};
