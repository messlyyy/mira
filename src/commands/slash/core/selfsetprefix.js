const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const selfPrefixPath = path.join(__dirname, '../../../data/selfprefix.json');
let selfprefix = require(selfPrefixPath);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ssp')
        .setDescription('Sets your personal prefix (usable across all servers).')
        .addStringOption(option =>
            option.setName('prefix')
                .setDescription('New personal prefix')
                .setRequired(true)
        ),
    async execute(interaction) {
        const userId = interaction.user.id;
        const newPrefix = interaction.options.getString('prefix').trim();

        selfprefix[userId] = { prefix: newPrefix };
        fs.writeFileSync(selfPrefixPath, JSON.stringify(selfprefix, null, 2));

        await interaction.reply({ content: `✅ Your personal prefix has been set to \`${newPrefix}\`.` });
    }
};
