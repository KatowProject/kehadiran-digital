const fs = require('fs');
const path = require('path');

module.exports = client => {

    client.commands = new Map();
    client.aliases = new Map();
    client.helps = new Map();

    fs.readdir(path.resolve(__dirname, '../commands/'), (err, categories) => {
        if (err) console.log(err);
        console.log(`Ditemukan ${categories.length} folder kategori.`);
        categories.forEach(category => {
            let Conf = require(`../commands/${category}/module.json`);
            Conf.path = `./commands/${category}`;
            Conf.cmds = [];
            client.helps.set(category, Conf);
            if(!Conf) return;
            fs.readdir(path.resolve(__dirname, `../commands/${category}`), (err, files) => {
                console.log(`Ditemukan ${files.length - 1} perintah dari folder ${category}.`);
                if(err) console.log(err);
                let commands = new Array();
                files.forEach(file => {
                    if(!file.endsWith('.js')) return;
                    let prop = require(`../commands/${category}/${file}`);
                    let cmdName = file.split('.')[0];
                    client.commands.set(prop.help.name, prop);
                    prop.conf.aliases.forEach(alias => {
                        client.aliases.set(alias, prop.help.name);
                    });
                    client.helps.get(category).cmds.push(prop.help.name);
                })
            })
        })
    })
}