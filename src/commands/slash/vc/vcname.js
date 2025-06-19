const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcname')
        .setDescription('Rename your temporary voice channel.')
        .addStringOption(option =>
            option.setName('new_name')
                .setDescription('New name for the VC')
                .setRequired(true)
                .setMaxLength(30)
        ),

    async execute(interaction) {
        const user = interaction.member;
        const voiceChannel = user.voice.channel;

        if (!voiceChannel) {
            return interaction.reply({ content: '❌ You must be in a voice channel to use this command.', ephemeral: true });
        }

        const vcsPath = './src/data/vcs.json';
        if (!fs.existsSync(vcsPath)) {
            return interaction.reply({ content: '❌ VC system is not initialized.', ephemeral: true });
        }

        const vcs = JSON.parse(fs.readFileSync(vcsPath, 'utf8'));
        const vcData = vcs[voiceChannel.id];

        if (!vcData) {
            return interaction.reply({ content: '❌ This voice channel is not registered as temporary.', ephemeral: true });
        }

        if (vcData.ownerId !== user.id) {
            return interaction.reply({ content: '❌ Only the owner of the channel can rename it.', ephemeral: true });
        }

        const newName = interaction.options.getString('new_name');

        try {
            await voiceChannel.setName(newName);
            return interaction.reply({ content: `✅ Renamed your channel to **${newName}**`, ephemeral: true });
        } catch (error) {
            console.error('Error renaming channel:', error);
            return interaction.reply({ content: '❌ Failed to rename the channel.', ephemeral: true });
        }
    }
};
