const qrcode = require('qrcode-terminal');
const Kato = require('./handler/ClientBuilder.js');
const { LocalAuth, } = require('whatsapp-web.js');
const client = new Kato({
    authStrategy: new LocalAuth({
        'clientId': 'client',
    }),
});

require('./handler/module.js')(client);
require('./handler/Event.js')(client);

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    qrcode.generate(qr,{small: true});
    console.log('QR RECEIVED', qr);
});

client.package = require('../../package.json');
client.on('disconnected', () => console.log('Disconnected!'));

// client.on('message', async (msg) => {
//     // cek list grup
//     if (msg.body == 'list') {
//         // liat grup yang ada
//         const chats = await client.getChats();
//         const groups = chats.filter(chat => chat.isGroup);
//         console.log(groups, chats);
//     }

//     if (msg.body == 'invite') {
//         const group = await msg.getChat();
//         try {
//             await group.addParticipants(['6285886295655@c.us']);
//         } catch (error) {
//             // send invite link if addParticipants fails
//             const inviteLink = await group.getInviteLink();
//             client.sendMessage(msg.from, inviteLink);
//         }
//     }

//     if (msg.body.includes('eval')) {
//         let codeIn = msg.body.replace('eval', '');
//         console.log(codeIn);
//         if (!codeIn) return msg.reply("No code provided");
//         let code = eval(codeIn);

//         console.log(code);

//         if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });

//         client.sendMessage(msg.from, code);
//     }
// });

process.on("unhandledRejection", (reason, promise) => {

    console.error("Unhandled Rejection at:", reason.stack || reason);
    console.error(reason);

});
  
process.on("uncaughtException", err => {
    console.error(new Date());
    console.error(`Caught exception: ${err}`);
    console.error(err);
    if (err.code == "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR") {
      console.error("true");
    }
});


client.initialize();