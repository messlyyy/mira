const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs');
const path = require('path');
const guildsPath = path.join(__dirname, '../../../data/guilds.json');
let guilds = require(guildsPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setprefix')
        .setDescription('Sets a custom prefix for this server.')
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('New prefix')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const guildId = interaction.guild.id;
        const newPrefix = interaction.options.getString('prefix').trim();

        guilds[guildId] = { prefix: newPrefix };
        fs.writeFileSync(guildsPath, JSON.stringify(guilds, null, 2));

        await interaction.reply({ content: `✅ Server prefix set to \`${newPrefix}\`.` });
    }
};
