module.exports = {
    name: 'promote',
    alias: ['admin', 'makeadmin', 'പദവി'],
    desc: 'Promote member to admin',
    category: 'group',
    adminOnly: true,
    execute: async (sock, msg, args, { config }) => {
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        if (!isGroup) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ This command only works in groups!'
            }, { quoted: msg });
            return;
        }

        try {
            // Check mentioned user
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const mentioned = quoted || (args[0]?.includes('@') ? [args[0]] : null);
            
            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Please mention a user to promote!\n\n` +
                          `Usage:\n` +
                          `${config.prefix}promote @user\n` +
                          `Or reply with ${config.prefix}promote`
                }, { quoted: msg });
                return;
            }

            const userToPromote = mentioned[0];
            
            // Check if already admin
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const userData = groupMetadata.participants.find(p => p.id === userToPromote);
            
            if (userData?.admin) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `👑 User is already an admin!`
                }, { quoted: msg });
                return;
            }

            // Promote the user
            await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToPromote], 'promote');
            
            const userNumber = userToPromote.split('@')[0];
            await sock.sendMessage(msg.key.remoteJid, {
                text: `👑 @${userNumber} has been promoted to Admin!`,
                mentions: [userToPromote]
            }, { quoted: msg });

        } catch (error) {
            console.error('Promote error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Failed to promote: ${error.message}\n\n` +
                      `Make sure:\n` +
                      `1. I'm admin in group\n` +
                      `2. User is in the group\n` +
                      `3. You have permission`
            }, { quoted: msg });
        }
    }
};