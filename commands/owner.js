module.exports = {
    name: 'owner',
    alias: ['creator', 'dev', 'ഓണർ', 'boss'],
    desc: 'Show bot owner information',
    category: 'general',
    execute: async (sock, msg, args, { config }) => {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `👑 *BOT OWNER INFORMATION*\n\n` +
                  `🤖 Bot: ${config.botName}\n` +
                  `👤 Name: ${config.ownerName}\n` +
                  `📞 Number: ${config.ownerNumber}\n` +
                  `💬 WhatsApp: wa.me/${config.ownerNumber}\n\n` +
                  `📧 Contact for:\n` +
                  `• Bug Reports\n` +
                  `• Feature Requests\n` +
                  `• Bot Hosting\n` +
                  `• Custom Bots\n\n` +
                  `🕊🦋⃝♥⃝ѕиєнα🍁♥⃝🦋⃝🕊`
        }, { quoted: msg });
    }
};