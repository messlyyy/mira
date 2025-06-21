// commands/vc/vcsetup.js

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { setupVC } = require('../../../utils/vcSetupModule');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcsetup')
        .setDescription('Initializes the voice channel system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            await setupVC(interaction.guild);
            await interaction.editReply({ content: '✅ VC system setup complete.' });
        } catch (err) {
            console.error('❌ Error in /vcsetup:', err);
            await interaction.editReply({ content: '❌ Something went wrong during setup.' });
        }
    }
};
