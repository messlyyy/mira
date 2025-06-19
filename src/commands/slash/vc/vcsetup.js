const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require('discord.js');

const names = require('../../../data/names.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vcsetup')
        .setDescription('Initializes the voice channel system.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });

        try {
            const guild = interaction.guild;

            const categoryName = names.categories[Math.floor(Math.random() * names.categories.length)];

            const category = await guild.channels.create({
                name: `📞 ${categoryName}`,
                type: ChannelType.GuildCategory,
            });

            const voiceChannel = await guild.channels.create({
                name: 'create',
                type: ChannelType.GuildVoice,
                parent: category.id,
            });

            const textChannel = await guild.channels.create({
                name: 'panel',
                type: ChannelType.GuildText,
                parent: category.id,
            });

            const embed = new EmbedBuilder()
                .setTitle('Mira VC Interface')
                .setDescription(
                    `You can use this interface to manage your voice channel.\n\n` +
                    `**🔒 Lock** – Prevent others from joining\n` +
                    `**🔓 Unlock** – Allow everyone to join\n` +
                    `**👻 Ghost** – Hide the VC from others\n` +
                    `**👁️ Show** – Make the VC visible again\n` +
                    `**🛡️ Claim** – Only you can use the buttons\n` +
                    `**🚪 Release** – Everyone can use the buttons\n\n` +
                    `✏️ Rename VC: \`/vcname <new name>\`\n` +
                    `⏰ Wake someone: \`/wakeup @user\``
                )
                .setImage('attachment://panelbuttons.png')
                .setColor('#333342')
                .setFooter({ text: 'Use the buttons below to manage your voice channel.' });

            const row1 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('lock').setEmoji('🔒').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('unlock').setEmoji('🔓').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('ghost').setEmoji('👻').setStyle(ButtonStyle.Secondary)
            );

            const row2 = new ActionRowBuilder().addComponents(
                new ButtonBuilder().setCustomId('show').setEmoji('👁️').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('claim').setEmoji('🛡️').setStyle(ButtonStyle.Secondary),
                new ButtonBuilder().setCustomId('release').setEmoji('🚪').setStyle(ButtonStyle.Secondary)
            );

            await textChannel.send({
                embeds: [embed],
                components: [row1, row2],
                files: [{
                    attachment: 'assets/panelbuttons.png',
                    name: 'panelbuttons.png'
                }]
            });

            await interaction.editReply({ content: '✅ VC system setup complete.' });
        } catch (err) {
            console.error('❌ Error in /vcsetup:', err);
            await interaction.editReply({ content: '❌ Something went wrong during setup.' });
        }
    }
};
