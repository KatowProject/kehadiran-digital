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

        // const group = await message.getChat();

        // // invite with mention someone
        // if (args.length > 0) {
        //     const contact = await client.getContactById(`${args[0]}@c.us`);
        //     await group.addParticipants([contact.id._serialized], {
        //         comment: `Halo {nama}, saya Bot Kato, asisten untuk workshop "HACKED YOUR SOUND". Saya ingin mengundang Anda ke grup peserta untuk mendapatkan informasi lebih lanjut. Izinkan saya menambahkan Anda ke dalam grup, ya!`
        //     });

        //     client.sendMessage(message.from, `Invite ${contact.name ?? 'Someone' } success!`);
        // } else {
        //     client.sendMessage(message.from, `Invite link: ${await group.getInviteCode()}`);
        // }

        // mass invite
        const group = await message.getChat();

        const users = [
            {
                nama: 'Haikal',
                phone: '6285886295655'
            },
            {
                nama: 'Harist',
                phone: '6281317053724'
            },
            {
                nama: 'Saepudin',
                phone: '6281315436892'
            },
            {
                nama: 'Gozali',
                phone: '6283815906967'
            }
        ]

        for (const user of users) {
            const contact = await client.getContactById(`${user.phone}@c.us`);
            await group.addParticipants([contact.id._serialized], {
                comment: `Halo ${user.nama}, saya Bot Kato, asisten untuk workshop "HACKED YOUR SOUND". Saya ingin mengundang Anda ke grup peserta untuk mendapatkan informasi lebih lanjut. Izinkan saya menambahkan Anda ke dalam grup, ya!`
            });

            await new Promise(resolve => setTimeout(resolve, 3000));
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
    name: 'massinvite',
    description: 'Menampilkan pengetesan jaringan bot Kato.',
    usage: 'invite',
    example: 'invite'
}