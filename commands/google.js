module.exports = {
    name: 'google',
    alias: ['search', 'ഗൂഗിൾ'],
    desc: 'Search Google',
    category: 'search',
    execute: async (sock, msg, args, { config }) => {
        const query = args.join(' ');
        
        if (!query) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Please provide a search query!\nUsage: ${config.prefix}google [query]`
            }, { quoted: msg });
            return;
        }
        
        const encodedQuery = encodeURIComponent(query);
        const searchUrl = `https://www.google.com/search?q=${encodedQuery}`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🔍 *GOOGLE SEARCH*\n\n` +
                  `📝 Query: ${query}\n\n` +
                  `🔗 Search Link:\n${searchUrl}\n\n` +
                  `💡 Tip: Click the link to view results\n\n` +
                  `${config.botName}`
        }, { quoted: msg });
    }
};