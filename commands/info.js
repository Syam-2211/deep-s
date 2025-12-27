module.exports = {
    name: 'info',
    alias: ['about', 'botinfo', 'വിവരങ്ങൾ'],
    desc: 'Show bot information',
    category: 'general',
    execute: async (sock, msg, args, { config, bot }) => {
        const uptime = bot.getUptime();
        const memory = Math.round(process.memoryUsage().rss / 1024 / 1024);
        const nodeVersion = process.version;
        const platform = process.platform;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${config.botName} *BOT INFORMATION*\n\n` +
                  `📛 Name: ${config.botName}\n` +
                  `👑 Owner: ${config.ownerName}\n` +
                  `🔢 Number: ${config.ownerNumber}\n` +
                  `⏰ Uptime: ${uptime}\n` +
                  `💾 Memory: ${memory} MB\n` +
                  `📊 Commands: ${config.commands.size}\n` +
                  `🌐 Platform: ${platform}\n` +
                  `⚙️ Node.js: ${nodeVersion}\n` +
                  `💬 Prefix: ${config.prefix}\n\n` +
                  `🛠️ Features:\n` +
                  `• Multi-Device ✅\n` +
                  `• Auto-Reconnect ✅\n` +
                  `• Media Support ✅\n` +
                  `• Group Tools ✅\n` +
                  `• Admin Controls ✅\n\n` +
                  `Powered by @whapi/baileys 🚀`
        }, { quoted: msg });
    }
};