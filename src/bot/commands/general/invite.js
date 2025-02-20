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

        const group = await message.getChat();

        // invite with mention someone
        if (args.length > 0) {
            const contact = await client.getContactById(`${args[0]}@c.us`);
            await group.addParticipants([contact.id._serialized], {
                comment: `Halo {nama}, saya Bot Kato, asisten untuk workshop "🎧 HACKED YOUR SOUND: SOUND DESIGN EXPLORATION 🎧". Saya ingin mengundang Anda ke grup peserta untuk mendapatkan informasi lebih lanjut. Izinkan saya menambahkan Anda ke dalam grup, ya!`
            });
            
            client.sendMessage(message.from, `Invite ${contact.name ?? 'Someone' } success!`);    
        } else {
            client.sendMessage(message.from, `Invite link: ${await group.getInviteCode()}`);
        }
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
    name: 'invite',
    description: 'Menampilkan pengetesan jaringan bot Kato.',
    usage: 'invite',
    example: 'invite'
}