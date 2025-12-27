module.exports = {
    name: 'fancy',
    alias: ['font', 'style', 'text', 'ഫാൻസി'],
    desc: 'Generate fancy text with categories',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const text = args.join(' ');
        
        if (!text) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: `${config.botName} *FANCY TEXT GENERATOR*\n\n` +
                      `📝 Usage:\n` +
                      `${config.prefix}fancy [text] - Show all styles\n` +
                      `${config.prefix}fancy [text] [style] - Specific style\n` +
                      `${config.prefix}fancy list - Show style categories\n\n` +
                      `💡 Example:\n` +
                      `${config.prefix}fancy Hello\n` +
                      `${config.prefix}fancy Hello bubble\n` +
                      `${config.prefix}fancy Hello cursive`
            }, { quoted: msg });
        }

        // If user wants to see categories
        if (text.toLowerCase() === 'list') {
            return await showCategories(sock, msg, config);
        }

        // Split text and style if provided
        const parts = text.split(' ');
        const userText = args[0] === 'list' ? args.slice(1).join(' ') : text;
        const requestedStyle = args.length > 1 && args[0] !== 'list' ? args.slice(-1)[0].toLowerCase() : null;
        
        const styles = generateAllStyles(userText);
        
        if (requestedStyle && styles[requestedStyle]) {
            // Return specific style
            return await sock.sendMessage(msg.key.remoteJid, {
                text: `🎨 *${requestedStyle.toUpperCase()} STYLE*\n\n` +
                      `📝 Original: ${userText}\n\n` +
                      `✨ Styled:\n${styles[requestedStyle]}\n\n` +
                      `💡 Copy and use it anywhere!\n` +
                      `${config.botName}`
            }, { quoted: msg });
        } else {
            // Show all styles in categories
            return await showAllStyles(sock, msg, config, userText, styles);
        }
    }
};

// Generate all text styles
function generateAllStyles(text) {
    return {
        // Bubble styles
        'bubble': text.split('').map(c => `ⓑ${c}`).join(''),
        'bubble2': text.split('').map(c => `🅑${c}`).join(''),
        'bubble3': text.split('').map(c => `🄱${c}`).join(''),
        
        // Square styles
        'square': text.split('').map(c => `🅂${c}`).join(''),
        'square2': text.split('').map(c => `🅼${c}`).join(''),
        
        // Circle styles
        'circle': text.split('').map(c => `Ⓒ${c}`).join(''),
        'circle2': text.split('').map(c => `Ⓞ${c}`).join(''),
        
        // Bold styles
        'bold': text.split('').map(c => `𝐁${c}`).join(''),
        'bold2': text.split('').map(c => `𝗕${c}`).join(''),
        'bold3': text.split('').map(c => `𝘽${c}`).join(''),
        
        // Italic styles
        'italic': text.split('').map(c => `𝐼${c}`).join(''),
        'italic2': text.split('').map(c => `𝘪${c}`).join(''),
        'italic3': text.split('').map(c => `𝙞${c}`).join(''),
        
        // Cursive styles
        'cursive': text.split('').map(c => `𝒞${c}`).join(''),
        'cursive2': text.split('').map(c => `𝓒${c}`).join(''),
        'cursive3': text.split('').map(c => `𝕮${c}`).join(''),
        
        // Gothic styles
        'gothic': text.split('').map(c => `𝔊${c}`).join(''),
        'gothic2': text.split('').map(c => `𝕲${c}`).join(''),
        
        // Monospace
        'mono': text.split('').map(c => `𝙼${c}`).join(''),
        'mono2': text.split('').map(c => `𝚖${c}`).join(''),
        
        // Small caps
        'smallcaps': text.toLowerCase().split('').map(c => {
            const map = {
                'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ',
                'h':'ʜ','i':'ɪ','j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ',
                'o':'ᴏ','p':'ᴘ','q':'Q','r':'ʀ','s':'ꜱ','t':'ᴛ','u':'ᴜ',
                'v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ'
            };
            return map[c] || c;
        }).join(''),
        
        // Upside down
        'upsidedown': text.split('').reverse().map(c => {
            const map = {
                'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ',
                'h':'ɥ','i':'ᴉ','j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u',
                'o':'o','p':'d','q':'b','r':'ɹ','s':'s','t':'ʇ','u':'n',
                'v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z',
                '!':'¡','?':'¿','.':'˙',',':'\'','\'':',','"':',,',
                '`':',',';':'؛',':':'ː'
            };
            return map[c.toLowerCase()] || c;
        }).join(''),
        
        // Strikethrough
        'strike': text.split('').map(c => `${c}̶`).join(''),
        
        // Underline
        'underline': text.split('').map(c => `${c}̲`).join(''),
        
        // Double underline
        'doubleunderline': text.split('').map(c => `${c}̳`).join(''),
        
        // Dotted
        'dotted': text.split('').map(c => `${c}̤`).join(''),
        
        // Wavy
        'wavy': text.split('').map(c => `${c}̰`).join(''),
        
        // Heart style
        'heart': text.split('').map(c => `${c}♥`).join(''),
        
        // Star style
        'star': text.split('').map(c => `${c}★`).join(''),
        
        // Sparkle style
        'sparkle': text.split('').map(c => `${c}✦`).join(''),
        
        // Moon style
        'moon': text.split('').map(c => `${c}☾`).join(''),
        
        // Flower style
        'flower': text.split('').map(c => `${c}✿`).join(''),
    };
}

// Show categories
async function showCategories(sock, msg, config) {
    const categories = `
🎭 *FANCY TEXT CATEGORIES*

🔵 *BUBBLE STYLES*
• bubble, bubble2, bubble3
• square, square2
• circle, circle2

🔤 *FONT STYLES*
• bold, bold2, bold3
• italic, italic2, italic3
• cursive, cursive2, cursive3
• gothic, gothic2
• mono, mono2
• smallcaps

🔄 *FUN STYLES*
• upsidedown - Flip text
• strike - Strikethrough
• underline, doubleunderline
• dotted, wavy

✨ *DECORATIVE STYLES*
• heart, star, sparkle
• moon, flower

📝 *Usage:*
${config.prefix}fancy [text] [style]
Example: ${config.prefix}fancy Hello bubble

${config.botName} 🎨
`;
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: categories
    }, { quoted: msg });
}

// Show all styles
async function showAllStyles(sock, msg, config, text, styles) {
    let output = `🎨 *FANCY TEXT GENERATOR*\n\n`;
    output += `📝 Original: *${text}*\n\n`;
    
    // Group styles by category
    const categories = {
        '🔵 BUBBLE': ['bubble', 'bubble2', 'bubble3', 'square', 'square2', 'circle', 'circle2'],
        '🔤 FONT': ['bold', 'bold2', 'bold3', 'italic', 'italic2', 'italic3', 'cursive', 'cursive2', 'cursive3', 'gothic', 'gothic2', 'mono', 'mono2', 'smallcaps'],
        '🔄 FUN': ['upsidedown', 'strike', 'underline', 'doubleunderline', 'dotted', 'wavy'],
        '✨ DECO': ['heart', 'star', 'sparkle', 'moon', 'flower']
    };
    
    Object.entries(categories).forEach(([category, styleList]) => {
        output += `${category}:\n`;
        styleList.forEach(style => {
            if (styles[style]) {
                output += `• ${style}: ${styles[style].substring(0, 20)}${styles[style].length > 20 ? '...' : ''}\n`;
            }
        });
        output += '\n';
    });
    
    output += `💡 Use: ${config.prefix}fancy [text] [style]\n`;
    output += `Example: ${config.prefix}fancy ${text} bubble\n\n`;
    output += `${config.botName} ✨`;
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: output
    }, { quoted: msg });
}