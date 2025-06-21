const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType
} = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('starting')
        .setDescription('Start setup for Mira modules'),

    async execute(interaction) {
        const usersPath = path.resolve(__dirname, '../../../../web/users.json');

        let users = [];
        try {
            const data = fs.readFileSync(usersPath, 'utf-8');
            users = JSON.parse(data);
        } catch (error) {
            console.error('❌ Error reading users.json:', error);
        }

        const userData = users.find(u => u.id === interaction.user.id);
        if (!userData) {
            const registerEmbed = new EmbedBuilder()
                .setTitle('🚧 You\'re not registered!')
                .setDescription('To use Mira\'s modules, please register your Discord account on the website.')
                .addFields({ name: '🌐 Register here', value: `[mirabot.site](https://mirabot.site)` })
                .setColor('#a82d43');

            return interaction.reply({ embeds: [registerEmbed], ephemeral: false });
        }

        const allModules = [
            { id: 'moderation', title: '🛠️ Moderation Module', description: 'Manage bans, timeouts, and automod rules.' },
            { id: 'vc', title: '🎙️ Voice Channel Module', description: 'Dynamic VC channels with full panel control.' },
            { id: 'entertainment', title: '🎉 Entertainment Module', description: 'Fun features like dripcheck and lootboxes.' },
            { id: 'protection', title: '🛡️ Protection Module', description: 'Anti-raid, anti-spam and more.' },
        ];

        let currentStep = 0;
        let selectedModules = [];

        const renderEmbed = (stepIndex) => {
            if (stepIndex < allModules.length) {
                const mod = allModules[stepIndex];
                return new EmbedBuilder()
                    .setTitle(mod.title)
                    .setDescription(mod.description)
                    .setColor('#3c3b40')
                    .setFooter({ text: `Step ${stepIndex + 1} of ${allModules.length + 1}` });
            } else {
                const selected = selectedModules.map(id => {
                    const mod = allModules.find(m => m.id === id);
                    return mod ? `• ${mod.title}` : '';
                }).join('\n');

                return new EmbedBuilder()
                    .setTitle('✨ Finishing up...')
                    .setDescription(`You've selected the following modules:\n\n${selected || '❌ No modules selected.'}\n\nDo you want to activate them now?`)
                    .setColor('#3c3b40')
                    .setFooter({ text: `Step ${allModules.length + 1} of ${allModules.length + 1}` });
            }
        };

        const getButtons = (stepIndex) => {
            const row = new ActionRowBuilder();

            if (stepIndex < allModules.length) {
                if (stepIndex > 0) {
                    row.addComponents(
                        new ButtonBuilder().setCustomId('starting_back').setLabel('← Back').setStyle(ButtonStyle.Secondary)
                    );
                }
                row.addComponents(
                    new ButtonBuilder().setCustomId('starting_skip').setLabel('Skip').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('starting_next').setLabel('Next →').setStyle(ButtonStyle.Primary)
                );
            } else {
                row.addComponents(
                    new ButtonBuilder().setCustomId('starting_back').setLabel('← Back').setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder().setCustomId('starting_cancel').setLabel('Cancel').setStyle(ButtonStyle.Danger),
                    new ButtonBuilder().setCustomId('starting_enable').setLabel('Activate Modules ✅').setStyle(ButtonStyle.Success)
                );
            }

            return [row];
        };

        const reply = await interaction.reply({
            embeds: [renderEmbed(currentStep)],
            components: getButtons(currentStep),
            ephemeral: false
        });

        const collector = reply.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 5 * 60 * 1000
        });

        collector.on('collect', async (btn) => {
            if (btn.user.id !== interaction.user.id) {
                return btn.reply({ content: '⛔ Only you can control this setup.', ephemeral: true });
            }

            const modId = allModules[currentStep]?.id;

            if (btn.customId === 'starting_next' && currentStep < allModules.length) {
                if (modId && !selectedModules.includes(modId)) {
                    selectedModules.push(modId);
                }
                currentStep++;
            }

            if (btn.customId === 'starting_skip' && currentStep < allModules.length) {
                currentStep++;
            }

            if (btn.customId === 'starting_back' && currentStep > 0) {
                currentStep--;
            }

            if (btn.customId === 'starting_cancel') {
                collector.stop();
                return btn.update({
                    embeds: [new EmbedBuilder()
                        .setTitle('❌ Setup cancelled.')
                        .setDescription('You can restart setup anytime by using `/starting` again.')
                        .setColor('#a82d43')],
                    components: []
                });
            }

            if (btn.customId === 'starting_enable' && currentStep === allModules.length) {
                collector.stop();
                return btn.update({
                    embeds: [new EmbedBuilder()
                        .setTitle('🚀 Setup Complete!')
                        .setDescription(`Activated modules:\n${selectedModules.map(id => '• ' + allModules.find(m => m.id === id)?.title).join('\n') || 'None.'}`)
                        .setColor('#7ab158')],
                    components: []
                });
            }

            await btn.update({
                embeds: [renderEmbed(currentStep)],
                components: getButtons(currentStep)
            });
        });

        collector.on('end', async () => {
            try {
                await interaction.editReply({ components: [] });
            } catch (err) {
                console.warn('⚠️ Could not clean up buttons:', err.message);
            }
        });
    }
};
