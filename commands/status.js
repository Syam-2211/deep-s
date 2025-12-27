module.exports = {
    name: 'status',
    alias: ['stats', 'സ്റ്റാറ്റസ്'],
    desc: 'Check bot and server status',
    category: 'general',
    execute: async (sock, msg, args, { config, bot }) => {
        const uptime = bot.getUptime();
        const memory = process.memoryUsage();
        const load = process.cpuUsage();
        
        const statusText = `📊 *SERVER STATUS*\n\n` +
                          `🤖 Bot: ${config.botName}\n` +
                          `🟢 Status: Online ✅\n` +
                          `⏰ Uptime: ${uptime}\n\n` +
                          `💾 Memory Usage:\n` +
                          `• RSS: ${Math.round(memory.rss / 1024 / 1024)} MB\n` +
                          `• Heap: ${Math.round(memory.heapUsed / 1024 / 1024)} MB\n\n` +
                          `⚡ Response: Live\n` +
                          `🌐 Connection: Stable\n\n` +
                          `👑 Owner: ${config.ownerName}`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: statusText
        }, { quoted: msg });
    }
};