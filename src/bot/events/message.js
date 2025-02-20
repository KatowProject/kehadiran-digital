const cooldowns = new Map();

module.exports = (client, message) => {
    
    let prefix;
    if(message.body.toLowerCase().startsWith(client.config.prefix[0])) {
        prefix = client.config.prefix[0];
    } else if (message.body.toLowerCase().startsWith(client.config.prefix[1])) {
        prefix = client.config.prefix[1];
    }

    if(!message.body.toLowerCase().startsWith(prefix)) return;

    let args = message.body.slice(prefix.length).trim().split(/ +/g);
    let msg = message.body.toLowerCase();
    let cmd = args.shift().toLowerCase();
    let sender = message.from;

    message.flags = [];
    while (args[0] && args[0][0] === '-') {
        message.flags.push(args.shift().slice(1));
    }
  
    let commandFile = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
    if(!commandFile) return;

    if (!cooldowns.has(commandFile.help.name)) {
        cooldowns.set(commandFile.help.name, new Map());
    };

    const member = message.from;
    const now = Date.now();
    const timestamps = cooldowns.get(commandFile.help.name);
    const cooldownAmount = (commandFile.conf.cooldown || 3) * 1000;

    if (!timestamps.has(member)) {
        if (!client.config.owners.includes(message.to)) {
          timestamps.set(member, now);
        }
      } else {
        const expirationTime = timestamps.get(member) + cooldownAmount;
    
        if (now < expirationTime) {
    
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(`Kamu bisa menggunakan perintah ini setelah ${timeLeft} detik!`);
          // Bisa diubah teks nya, kalo misalnya user nya lagi cooldown.
        }
    
        timestamps.set(member, now);
        setTimeout(() => timestamps.delete(member), cooldownAmount);
    }

    try {
        let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
        command.run(client, message, args);

    } catch (e) {
        console.log(e.message);
    } finally {
        console.log(`ID: ${sender} ran ${cmd}`);
    }
}