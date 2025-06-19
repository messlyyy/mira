const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
        .setCustomId('lock')
        .setLabel('Lock')
        .setStyle(ButtonStyle.Danger)
        .setEmoji('🔒'),

    new ButtonBuilder()
        .setCustomId('unlock')
        .setLabel('Unlock')
        .setStyle(ButtonStyle.Success)
        .setEmoji('🔓'),

    new ButtonBuilder()
        .setCustomId('ghost')
        .setLabel('Ghost')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🙈'),

    new ButtonBuilder()
        .setCustomId('show')
        .setLabel('Show')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('👁️'),

    new ButtonBuilder()
        .setCustomId('claim')
        .setLabel('Claim')
        .setStyle(ButtonStyle.Primary)
        .setEmoji('🛡️'),

    new ButtonBuilder()
        .setCustomId('release')
        .setLabel('Release')
        .setStyle(ButtonStyle.Secondary)
        .setEmoji('🚪')
);
