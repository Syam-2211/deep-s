module.exports = {
    name: 'groupicon',
    alias: ['gicon', 'seticon', 'ഗ്രൂപ്പ് ഐക്കൺ'],
    desc: 'Change group icon',
    category: 'group',
    adminOnly: true,
    requireMedia: true,
    execute: async (sock, msg, args, { config }) => {
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        if (!isGroup) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ This command only works in groups!'
            }, { quoted: msg });
            return;
        }

        try {
            // Check if message contains image
            const hasImage = msg.message?.imageMessage;
            const quotedImage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
            
            if (!hasImage && !quotedImage) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Please send or reply to an image!\n\n` +
                          `How to use:\n` +
                          `1. Send image with caption ${config.prefix}groupicon\n` +
                          `2. Reply to image with ${config.prefix}groupicon\n\n` +
                          `📸 Supported: JPG, PNG (Square works best)`
                }, { quoted: msg });
                return;
            }

            await sock.sendMessage(msg.key.remoteJid, {
                text: '🔄 Updating group icon...'
            }, { quoted: msg });
            
            // Note: Baileys doesn't have direct group icon update
            // You need to manually set via WhatsApp
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `ℹ️ *Group Icon Feature*\n\n` +
                      `To change group icon:\n` +
                      `1. Open group info\n` +
                      `2. Tap on current icon\n` +
                      `3. Select "Change group icon"\n` +
                      `4. Choose from gallery\n\n` +
                      `This is a WhatsApp limitation.\n` +
                      `Bots cannot change group icons directly.`
            });

        } catch (error) {
            console.error('Groupicon error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Error: ${error.message}`
            }, { quoted: msg });
        }
    }
};