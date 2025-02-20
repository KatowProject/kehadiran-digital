const Kato = require("../../handler/ClientBuilder");
const { Message } = require("whatsapp-web.js");

/**
 * @param {Kato} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    try {
        let codeIn = args.join(" ");
        if (!codeIn) return message.reply("No code provided");
        let code = eval(codeIn);

        if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });

        client.sendMessage(message.from, code);
    } catch (error) {

        client.sendMessage(message.from, `Something went wrong: ${error.message}`);
        return console.log(error);
        // Restart the bot as usual. 
    }
}

exports.conf = {
    aliases: [],
    cooldown: 10
}

exports.help = {
    name: 'eval',
    description: 'Menampilkan pengetesan jaringan bot Kato.',
    usage: 'invite',
    example: 'invite'
}