const fs = require('fs');
const path = require('path');

module.exports = (client) => {
    const eventFolders = fs.readdirSync(path.join(__dirname, '../events'));

    for (const folder of eventFolders) {
        const eventFiles = fs.readdirSync(path.join(__dirname, '../events', folder)).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(path.join(__dirname, '../events', folder, file));
            const eventName = file.split('.')[0];
            if (folder === 'client') {
                client.once(eventName, (...args) => event(client, ...args));
            } else {
                client.on(eventName, (...args) => event(client, ...args));
            }
        }
    }
};
