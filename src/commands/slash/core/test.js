const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription('Check if slash commands work'),
    async execute(interaction) {
        await interaction.reply('✅ Slash command working!');
    }
};
