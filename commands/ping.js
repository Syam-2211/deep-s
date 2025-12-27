module.exports = {
    name: 'ping',
    alias: ['speed', 'test', 'പിങ്'],
    desc: 'Check bot response speed',
    category: 'general',
    execute: async (sock, msg, args, { config, bot }) => {
        const start = Date.now();
        await sock.sendPresenceUpdate('available', msg.key.remoteJid);
        const latency = Date.now() - start;
        const uptime = bot.getUptime();
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🏓 *PONG!*\n\n` +
                  `⚡ Latency: ${latency}ms\n` +
                  `⏰ Uptime: ${uptime}\n` +
                  `📊 Commands: ${config.commands.size}\n\n` +
                  `🤖 ${config.botName}\n` +
                  `👑 Owner: ${config.ownerName}`
        }, { quoted: msg });
    }
};