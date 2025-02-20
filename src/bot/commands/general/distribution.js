const Kato = require("../../handler/ClientBuilder");
const { Message, MessageMedia} = require("whatsapp-web.js");
const fs = require('fs');

/**
 * @param {Kato} client 
 * @param {Message} message 
 * @param {[]} args 
 * @returns 
 */
exports.run = async (client, message, args) => {
    try {
        const listGambar = fs.readdirSync('images/qr');
        console.log(listGambar);
        
        const users = [
            {
                nama: 'Haikal',
                phone: '6285886295655'
            },
            {
                nama: 'Harist',
                phone: '6281317053724'
            },
            // {
            //     nama: 'Saepudin',
            //     phone: '6281315436892'
            // },
            // {
            //     nama: 'Gozali',
            //     phone: '6283815906967'
            // }
        ]

        // kirim pesan ke semua kontak dengan gambar
        
        for (const user of users) {
            
            const randomGambar = listGambar[Math.floor(Math.random() * listGambar.length)];
            
            const media = new MessageMedia('image/png', fs.readFileSync(`images/qr/${randomGambar}`, { encoding: 'base64' }));

            // kirim pesan ke kontak
            await client.sendMessage(`${user.phone}@c.us`,
                media,
                {
                    caption: `Ini QR Code untuk ${user.nama}, akan digunakan untuk masuk dan keluar ruangan.`

                }
            );
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
    name: 'distribution',
    description: 'Menampilkan pengetesan jaringan bot Kato.',
    usage: 'invite',
    example: 'invite'
}