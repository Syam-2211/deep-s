module.exports = {
    name: 'fancy',
    alias: ['style', 'font', 'ഫാൻസി'],
    desc: 'Generate fancy/stylish text',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const text = args.join(' ');
        
        if (!text) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Please provide text!\n\n` +
                      `📝 Usage: ${config.prefix}fancy [text]\n` +
                      `Example: ${config.prefix}fancy Hello World\n\n` +
                      `💡 Available styles:\n` +
                      `${config.prefix}fancy [text] - All styles\n` +
                      `${config.prefix}fancy [text] [style] - Specific style`
            }, { quoted: msg });
            return;
        }

        // Fancy text styles
        const fancyTexts = {
            // Bubble/Box styles
            'ⓑⓤⓑⓑⓛⓔ': text.split('').map(char => `ⓑ${char}`).join(''),
            '🅑🅤🅑🅑🅛🅔': text.split('').map(char => `🅑${char}`).join(''),
            '𝕓𝕦𝕓𝕓𝕝𝕖': text.split('').map(char => `𝕓${char}`).join(''),
            
            // Double Struck
            '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜': text.split('').map(char => 
                `𝔻${char}`
            ).join(''),
            
            // Cursive/Script
            '𝒞𝓊𝓇𝓈𝒾𝓋ℯ': text.split('').map(char => 
                `𝒞${char}`
            ).join(''),
            '𝓒𝓾𝓻𝓼𝓲𝓿𝓮': text.split('').map(char => 
                `𝓒${char}`
            ).join(''),
            
            // Monospace
            '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎': text.split('').map(char => 
                `𝙼${char}`
            ).join(''),
            
            // Small Caps
            'ꜱᴍᴀʟʟ ᴄᴀᴘꜱ': text.toLowerCase().split('').map(char => {
                const smallCaps = {
                    'a': 'ᴀ', 'b': 'ʙ', 'c': 'ᴄ', 'd': 'ᴅ', 'e': 'ᴇ',
                    'f': 'ꜰ', 'g': 'ɢ', 'h': 'ʜ', 'i': 'ɪ', 'j': 'ᴊ',
                    'k': 'ᴋ', 'l': 'ʟ', 'm': 'ᴍ', 'n': 'ɴ', 'o': 'ᴏ',
                    'p': 'ᴘ', 'q': 'Q', 'r': 'ʀ', 's': 'ꜱ', 't': 'ᴛ',
                    'u': 'ᴜ', 'v': 'ᴠ', 'w': 'ᴡ', 'x': 'x', 'y': 'ʏ', 'z': 'ᴢ'
                };
                return smallCaps[char] || char;
            }).join(''),
            
            // Upside Down
            'ᴜᴘsɪᴅᴇ ᴅᴏᴡɴ': text.split('').reverse().map(char => {
                const upsideDown = {
                    'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ',
                    'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ', 'i': 'ᴉ', 'j': 'ɾ',
                    'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o',
                    'p': 'd', 'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ',
                    'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x', 'y': 'ʎ', 'z': 'z'
                };
                return upsideDown[char.toLowerCase()] || char;
            }).join(''),
            
            // Strikethrough
            's̶t̶r̶i̶k̶e̶': text.split('').map(char => `${char}̶`).join(''),
            
            // Underline
            'u̲n̲d̲e̲r̲l̲i̲n̲e̲': text.split('').map(char => `${char}̲`).join(''),
            
            // Dotted
            'd̤o̤t̤t̤e̤d̤': text.split('').map(char => `${char}̤`).join(''),
        };

        // Generate fancy text
        let output = `🎨 *FANCY TEXT GENERATOR*\n\n`;
        output += `📝 Original: ${text}\n\n`;
        output += `✨ *Styled Texts:*\n\n`;
        
        Object.entries(fancyTexts).forEach(([styleName, styledText]) => {
            output += `*${styleName}:*\n${styledText}\n\n`;
        });

        // Add more styles in a compact format
        output += `🔤 *More Styles:*\n`;
        output += `➤ 𝐁𝐨𝐥𝐝: ${text.split('').map(c => `𝐁${c}`).join('')}\n`;
        output += `➤ 𝐼𝑡𝑎𝑙𝑖𝑐: ${text.split('').map(c => `𝐼${c}`).join('')}\n`;
        output += `➤ 𝘛𝘩𝘪𝘯: ${text.split('').map(c => `𝘛${c}`).join('')}\n`;
        output += `➤ Ⓒⓘⓡⓒⓛⓔⓓ: ${text.split('').map(c => `Ⓒ${c}`).join('')}\n`;
        output += `➤ 🅂🅀🅄🄰🅁🄴: ${text.split('').map(c => `🅂${c}`).join('')}\n`;

        output += `\n${config.botName} 🎀`;

        await sock.sendMessage(msg.key.remoteJid, {
            text: output
        }, { quoted: msg });
    }
};