const fs = require('fs');

module.exports = async (client, interaction) => {
    // ─── SLASH COMMANDS ─────────────────────────────────────────────────────
    if (interaction.isChatInputCommand()) {
        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;
        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.deferred || interaction.replied) {
                await interaction.editReply({ content: '❌ Error executing the command.' });
            } else {
                await interaction.reply({ content: '❌ Error executing the command.', ephemeral: true });
            }
        }
    }

    // ─── PANEL BUTTONS ───────────────────────────────────────────────────────
    if (interaction.isButton()) {
        const panelButtonIds = ['lock', 'unlock', 'ghost', 'show', 'claim', 'release'];
        if (!panelButtonIds.includes(interaction.customId)) return;

        try {
            const voiceChannel = interaction.member.voice?.channel;
            if (!voiceChannel) {
                return interaction.reply({ content: '❌ You are not in a voice channel.', ephemeral: true });
            }

            let vcs = {};
            try {
                const raw = fs.readFileSync('./src/data/vcs.json', 'utf8');
                vcs = raw ? JSON.parse(raw) : {};
            } catch (err) {
                console.error('⚠️ Error reading vcs.json:', err);
                return interaction.reply({ content: '❌ Failed to read VC data.', ephemeral: true });
            }

            const vcData = vcs[voiceChannel.id];
            if (!vcData) {
                return interaction.reply({ content: '❌ This VC is not registered as temporary.', ephemeral: true });
            }

            if (vcData.private && interaction.user.id !== vcData.ownerId) {
                return interaction.reply({ content: '❌ Only the VC owner can use this button.', ephemeral: true });
            }

            switch (interaction.customId) {
                case 'lock':
                    await voiceChannel.permissionOverwrites.edit(voiceChannel.guild.id, { Connect: false });
                    await interaction.reply({ content: '🔒 Channel locked.', ephemeral: true });
                    break;
                case 'unlock':
                    await voiceChannel.permissionOverwrites.edit(voiceChannel.guild.id, { Connect: true });
                    await interaction.reply({ content: '🔓 Channel unlocked.', ephemeral: true });
                    break;
                case 'ghost':
                    await voiceChannel.permissionOverwrites.edit(voiceChannel.guild.id, { ViewChannel: false });
                    await interaction.reply({ content: '🙈 Channel hidden.', ephemeral: true });
                    break;
                case 'show':
                    await voiceChannel.permissionOverwrites.edit(voiceChannel.guild.id, { ViewChannel: true });
                    await interaction.reply({ content: '👁️ Channel visible again.', ephemeral: true });
                    break;
                case 'claim':
                    vcData.private = true;
                    fs.writeFileSync('./src/data/vcs.json', JSON.stringify(vcs, null, 2));
                    await interaction.reply({ content: '🛡️ Private mode activated. Only you can use the panel.', ephemeral: true });
                    break;
                case 'release':
                    vcData.private = false;
                    fs.writeFileSync('./src/data/vcs.json', JSON.stringify(vcs, null, 2));
                    await interaction.reply({ content: '🚪 Private mode disabled. Anyone can use the panel.', ephemeral: true });
                    break;
                default:
                    await interaction.reply({ content: '❌ Unknown button.', ephemeral: true });
            }

        } catch (err) {
            console.error('❌ Error handling panel button:', err);
            return interaction.reply({ content: '❌ Something went wrong with the button.', ephemeral: true });
        }
    }
};
