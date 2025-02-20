exports.run = async (client, message, args) => {

  try {
        client.sendMessage(message.from, 'pong!');
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
  name: 'ping',
  description: 'Menampilkan pengetesan jaringan bot Kato.',
  usage: 'ping',
  example: 'ping'
}