const { readdirSync } = require('fs');
const path = require('path');

module.exports = client => {
    const events = readdirSync(path.resolve(__dirname, '../events')).filter(file => file.endsWith('.js'));
        for(let event of events) {
            let file = require(`../events/${event}`);
            client.on(event.split('.')[0], (...args) => file(client, ...args));
        }
};