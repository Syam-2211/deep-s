// commands/play.js (Music Download)
module.exports = {
    name: 'play',
    alias: ['song', 'music', 'പാട്ട്'],
    desc: 'Download songs from YouTube',
    category: 'download',
    execute: async (sock, msg, args, { config }) => {
        const song = args.join(' ');
        if (!song) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Please provide song name!\nUsage: ${config.prefix}play [song name]`
            }, { quoted: msg });
            return;
        }
        await sock.sendMessage(msg.key.remoteJid, {
            text: `🎵 *Searching: ${song}*\n\nThis feature requires YouTube API.\nComing soon!`
        }, { quoted: msg });
    }
};