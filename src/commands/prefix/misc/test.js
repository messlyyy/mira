module.exports = {
    name: 'test',
    description: 'Check if prefix commands work',
    async execute(client, message, args) {
        message.reply('✅ Prefix command working!');
    }
};
