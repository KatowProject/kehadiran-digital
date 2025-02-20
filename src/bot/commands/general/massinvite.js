const Kato = require("../../handler/ClientBuilder");
const { Message, MessageMedia } = require("whatsapp-web.js");
const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * @param {Kato} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    try {
        const User = prisma.peserta;

        const dirQr = fs.readdirSync('assets/qr');
        const qr = dirQr.filter(file => file.endsWith('.jpeg'));

        const group = await message.getChat();
        const users = await User.findMany();

        for (const user of users) {
            const contact = await client.getContactById(`${user.no_handphone}@c.us`);
            await group.addParticipants([contact.id._serialized], {
                comment: `Halo ${user.nama}, saya Bot Kato, asisten untuk workshop "🎧 HACKED YOUR SOUND: SOUND DESIGN EXPLORATION 🎧". Saya ingin mengundang Anda ke grup peserta untuk mendapatkan informasi lebih lanjut. Izinkan saya menambahkan Anda ke dalam grup, ya!`
            });
            
            const qrCode = qr.find(file => file.includes(user.nim));
            const media = MessageMedia.fromFilePath(`assets/qr/${qrCode}`);
            await client.sendMessage(contact.id._serialized, media, {
                caption: `Ada QR Code untuk masuk ke grup workshop "🎧 HACKED YOUR SOUND: SOUND DESIGN EXPLORATION 🎧". Silakan scan QR Code ini untuk masuk ke grup.`
            });

            await new Promise(resolve => setTimeout(resolve, 3000));
        }

        client.sendMessage(message.from, `Invite ${users.length} success!`);
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