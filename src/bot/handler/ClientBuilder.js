const { Client } = require('whatsapp-web.js');
const Util = require('./Util.js');

module.exports = class Kato extends Client {
    /**
     * 
     * @param {Object} opt
     * @param {import('whatsapp-web.js').Auth} opt.authStrategy 
     */
    constructor(opt) {
        super(opt);

        this.util = new Util();
        this.config = require('../../../config.json');
        this.commands = new Map();
        this.cooldown = new Map();
        this.aliases = new Map();
        this.recent = new Set();

    }

}