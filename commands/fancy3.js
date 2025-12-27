module.exports = {
    name: 'fancy',
    alias: ['font', 'text', 'stylish', 'ഫാൻസി'],
    desc: 'Interactive fancy text generator',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const text = args.join(' ');
        
        if (!text) {
            // Create interactive buttons for help
            const buttonMessage = {
                text: `${config.botName} *FANCY TEXT GENERATOR* 🎨\n\n` +
                      `Generate stylish text for:\n` +
                      `• Social Media Bios\n` +
                      `• WhatsApp Status\n` +
                      `• Instagram Captions\n` +
                      `• Gaming Names\n\n` +
                      `📝 *Send text to style!*\n` +
                      `Example: Hello World`,
                footer: `Tap buttons below for quick styles`,
                headerType: 1,
                buttons: [
                    { buttonId: `${config.prefix}fancy bubble`, buttonText: { displayText: '🔵 Bubble' }, type: 1 },
                    { buttonId: `${config.prefix}fancy bold`, buttonText: { displayText: '🔤 Bold' }, type: 1 },
                    { buttonId: `${config.prefix}fancy cursive`, buttonText: { displayText: '✨ Cursive' }, type: 1 }
                ],
                sections: [
                    {
                        title: "Quick Examples",
                        rows: [
                            { title: "Bubble Style", rowId: `${config.prefix}fancy Example bubble` },
                            { title: "Cursive Style", rowId: `${config.prefix}fancy Example cursive` },
                            { title: "Small Caps", rowId: `${config.prefix}fancy Example smallcaps` },
                            { title: "Upside Down", rowId: `${config.prefix}fancy Example upsidedown` }
                        ]
                    }
                ]
            };
            
            await sock.sendMessage(msg.key.remoteJid, buttonMessage, { quoted: msg });
            return;
        }
        
        // Generate fancy text
        const styles = generateFancyStyles(text);
        
        // Create response with sections
        const fancyMessage = {
            text: `🎨 *FANCY TEXT GENERATED*\n\n` +
                  `📝 Original: ${text}\n\n` +
                  `✨ *Popular Styles:*`,
            footer: `${config.botName} • Copy any style below`,
            headerType: 1,
            sections: [
                {
                    title: "Bubble Styles 🟣",
                    rows: [
                        { title: "ⓑⓤⓑⓑⓛⓔ", description: styles.bubble.substring(0, 20), rowId: `copy_${styles.bubble}` },
                        { title: "🅑🅤🅑🅑🅛🅔", description: styles.bubble2.substring(0, 20), rowId: `copy_${styles.bubble2}` },
                        { title: "🄱🅄🄱🄱🄻🄴", description: styles.bubble3.substring(0, 20), rowId: `copy_${styles.bubble3}` }
                    ]
                },
                {
                    title: "Font Styles 🔤",
                    rows: [
                        { title: "𝐁𝐨𝐥𝐝", description: styles.bold.substring(0, 20), rowId: `copy_${styles.bold}` },
                        { title: "𝐼𝑡𝑎𝑙𝑖𝑐", description: styles.italic.substring(0, 20), rowId: `copy_${styles.italic}` },
                        { title: "𝒞𝓊𝓇𝓈𝒾𝓋𝑒", description: styles.cursive.substring(0, 20), rowId: `copy_${styles.cursive}` }
                    ]
                },
                {
                    title: "Fun Styles 🎭",
                    rows: [
                        { title: "ᴜᴘsɪᴅᴇ ᴅᴏᴡɴ", description: styles.upsidedown.substring(0, 20), rowId: `copy_${styles.upsidedown}` },
                        { title: "s̶t̶r̶i̶k̶e̶", description: styles.strike.substring(0, 20), rowId: `copy_${styles.strike}` },
                        { title: "sᴍᴀʟʟᴄᴀᴘs", description: styles.smallcaps.substring(0, 20), rowId: `copy_${styles.smallcaps}` }
                    ]
                },
                {
                    title: "Decorative Styles ✨",
                    rows: [
                        { title: "♥ Heart", description: styles.heart.substring(0, 20), rowId: `copy_${styles.heart}` },
                        { title: "★ Star", description: styles.star.substring(0, 20), rowId: `copy_${styles.star}` },
                        { title: "✿ Flower", description: styles.flower.substring(0, 20), rowId: `copy_${styles.flower}` }
                    ]
                }
            ]
        };
        
        await sock.sendMessage(msg.key.remoteJid, fancyMessage, { quoted: msg });
        
        // Also send as regular text for easy copying
        await sock.sendMessage(msg.key.remoteJid, {
            text: `📋 *EASY COPY VERSION*\n\n` +
                  `ⓑⓊⓑⓑⓛⓔ: ${styles.bubble}\n` +
                  `𝐁𝐨𝐥𝐝: ${styles.bold}\n` +
                  `𝒞𝓊𝓇𝓈𝒾𝓋𝑒: ${styles.cursive}\n` +
                  `ᴜᴘsɪᴅᴇ ᴅᴏᴡɴ: ${styles.upsidedown}\n` +
                  `s̶t̶r̶i̶k̶e̶: ${styles.strike}\n` +
                  `♥: ${styles.heart}\n\n` +
                  `💡 Just copy and paste anywhere!`
        });
    }
};

function generateFancyStyles(text) {
    // Bubble styles
    const bubble = text.split('').map(c => `ⓑ${c}`).join('');
    const bubble2 = text.split('').map(c => `🅑${c}`).join('');
    const bubble3 = text.split('').map(c => `🄱${c}`).join('');
    
    // Font styles
    const bold = text.split('').map(c => `𝐁${c}`).join('');
    const italic = text.split('').map(c => `𝐼${c}`).join('');
    const cursive = text.split('').map(c => `𝒞${c}`).join('');
    
    // Fun styles
    const smallcaps = text.toLowerCase().split('').map(c => {
        const map = { 'a':'ᴀ','b':'ʙ','c':'ᴄ','d':'ᴅ','e':'ᴇ','f':'ꜰ','g':'ɢ','h':'ʜ','i':'ɪ',
                     'j':'ᴊ','k':'ᴋ','l':'ʟ','m':'ᴍ','n':'ɴ','o':'ᴏ','p':'ᴘ','q':'Q','r':'ʀ',
                     's':'ꜱ','t':'ᴛ','u':'ᴜ','v':'ᴠ','w':'ᴡ','x':'x','y':'ʏ','z':'ᴢ' };
        return map[c] || c;
    }).join('');
    
    const upsidedown = text.split('').reverse().map(c => {
        const map = { 'a':'ɐ','b':'q','c':'ɔ','d':'p','e':'ǝ','f':'ɟ','g':'ƃ','h':'ɥ','i':'ᴉ',
                     'j':'ɾ','k':'ʞ','l':'l','m':'ɯ','n':'u','o':'o','p':'d','q':'b','r':'ɹ',
                     's':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z',
                     '!':'¡','?':'¿','.':'˙',',':'\'' };
        return map[c.toLowerCase()] || c;
    }).join('');
    
    const strike = text.split('').map(c => `${c}̶`).join('');
    
    // Decorative styles
    const heart = text.split('').map(c => `${c}♥`).join('');
    const star = text.split('').map(c => `${c}★`).join('');
    const flower = text.split('').map(c => `${c}✿`).join('');
    
    return { bubble, bubble2, bubble3, bold, italic, cursive, smallcaps, upsidedown, strike, heart, star, flower };
}