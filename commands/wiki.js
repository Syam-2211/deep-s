module.exports = {
    name: 'wiki',
    alias: ['wikipedia', 'വിക്കി'],
    desc: 'Search Wikipedia',
    category: 'search',
    execute: async (sock, msg, args, { config }) => {
        const query = args.join(' ');
        
        if (!query) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Please provide a topic!\nUsage: ${config.prefix}wiki [topic]`
            }, { quoted: msg });
            return;
        }
        
        const encodedQuery = encodeURIComponent(query);
        const wikiUrl = `https://en.wikipedia.org/wiki/${encodedQuery}`;
        const wikiSearch = `https://en.wikipedia.org/w/index.php?search=${encodedQuery}`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `📚 *WIKIPEDIA SEARCH*\n\n` +
                  `📖 Topic: ${query}\n\n` +
                  `🔗 Direct Link:\n${wikiUrl}\n\n` +
                  `🔍 Search Page:\n${wikiSearch}\n\n` +
                  `${config.botName}`
        }, { quoted: msg });
    }
};