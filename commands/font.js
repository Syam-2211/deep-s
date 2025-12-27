module.exports = {
    name: 'font',
    alias: ['fancy', 'text', 'style', 'ഫോണ്ട്'],
    desc: 'Generate popular fancy fonts',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const text = args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: `🎀 *FANCY FONT GENERATOR*\n\n` +
                      `Create cool text for:\n` +
                      `• Instagram Bio\n` +
                      `• WhatsApp Name\n` +
                      `• Gaming Username\n` +
                      `• Social Media\n\n` +
                      `📝 Usage: ${config.prefix}font [text]\n` +
                      `Example: ${config.prefix}font SNEHA\n\n` +
                      `${config.botName} ✨`
            }, { quoted: msg });
        }
        
        // Most popular 10 styles
        const fonts = {
            'Bubble': `ⓢⓝⓔⓗⓐ`,
            'Square': `🅂🄽🄴🄷🄰`,
            'Bold': `𝐒𝐍𝐄𝐇𝐀`,
            'Italic': `𝑆𝑁𝐸𝐻𝐴`,
            'Cursive': `𝒮𝒩𝐸𝐻𝒜`,
            'Gothic': `𝔖𝔑𝔈ℌ𝔄`,
            'Small Caps': `ꜱɴᴇʜᴀ`,
            'Strike': `S̶N̶E̶H̶A̶`,
            'Underline': `S̲N̲E̲H̲A̲`,
            'Heart': `S♥N♥E♥H♥A`
        };
        
        // Replace SNEHA with actual text
        const result = {};
        Object.entries(fonts).forEach(([name, font]) => {
            result[name] = applyStyle(text, name);
        });
        
        let output = `✨ *FANCY FONTS FOR: ${text}*\n\n`;
        
        Object.entries(result).forEach(([name, styledText]) => {
            output += `*${name}:*\n${styledText}\n\n`;
        });
        
        output += `💡 *How to use:*\n`;
        output += `1. Copy any style above\n`;
        output += `2. Paste in WhatsApp/Instagram\n`;
        output += `3. Use as name, bio, or status\n\n`;
        output += `${config.botName} 🎨`;
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: output
        }, { quoted: msg });
    }
};

function applyStyle(text, style) {
    switch(style) {
        case 'Bubble':
            return text.split('').map(c => `ⓑ${c}`).join('');
        case 'Square':
            return text.split('').map(c => `🅂${c}`).join('');
        case 'Bold':
            return text.split('').map(c => `𝐁${c}`).join('');
        case 'Italic':
            return text.split('').map(c => `𝐼${c}`).join('');
        case 'Cursive':
            return text.split('').map(c => `𝒞${c}`).join('');
        case 'Gothic':
            return text.split('').map(c => `𝔊${c}`).join('');
        case 'Small Caps':
            return text.toLowerCase().split('').map(c => {
                const map = {'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ',
                           'h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ',
                           'o':'ᴏ','p':'ᴘ','q':'Q','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ',
                           'v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'};
                return map[c] || c;
            }).join('');
        case 'Strike':
            return text.split('').map(c => `${c}̶`).join('');
        case 'Underline':
            return text.split('').map(c => `${c}̲`).join('');
        case 'Heart':
            return text.split('').map(c => `${c}♥`).join('');
        default:
            return text;
    }
}