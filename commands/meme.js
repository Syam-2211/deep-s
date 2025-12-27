module.exports = {
    name: 'meme',
    alias: ['memes', 'മീം'],
    desc: 'Get random memes',
    category: 'fun',
    execute: async (sock, msg, args) => {
        const memes = [
            { text: "When you realize Monday is tomorrow...", type: "monday" },
            { text: "Me: I'll sleep early tonight\nAlso me at 3 AM:", type: "sleep" },
            { text: "My brain: Don't say it\nMy mouth:", type: "brain" },
            { text: "What I think I look like vs What I actually look like", type: "confidence" },
            { text: "When someone says 'calm down'", type: "anger" }
        ];
        
        const randomMeme = memes[Math.floor(Math.random() * memes.length)];
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `😂 *MEME*\n\n${randomMeme.text}\n\n` +
                  `Type: ${randomMeme.type}\n\n` +
                  `🔄 Send .meme again for more!`
        }, { quoted: msg });
    }
};