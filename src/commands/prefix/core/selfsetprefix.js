const fs = require('fs');
const path = require('path');
const selfPrefixPath = path.join(__dirname, '../../../data/selfprefix.json');
let selfprefix = require(selfPrefixPath);

module.exports = {
    name: 'ssp',
    description: 'Sets your personal prefix (usable across all servers).',
    async execute(client, message, args) {
        const userId = message.author.id;
        const newPrefix = args[0];

        if (!newPrefix) {
            return message.reply('❌ Please provide a new personal prefix.');
        }

        selfprefix[userId] = { prefix: newPrefix.trim() };
        fs.writeFileSync(selfPrefixPath, JSON.stringify(selfprefix, null, 2));

        message.reply(`✅ Your personal prefix has been set to \`${newPrefix}\`.`);
    }
};
