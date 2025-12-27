module.exports = {
    name: 'demote',
    alias: ['removeadmin', 'unadmin', 'അഡ്മിൻനീക്കം'],
    desc: 'Remove admin status from member',
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
                    text: `❌ Please mention an admin to demote!\n\n` +
                          `Usage:\n` +
                          `${config.prefix}demote @user\n` +
                          `Or reply with ${config.prefix}demote`
                }, { quoted: msg });
                return;
            }

            const userToDemote = mentioned[0];
            const sender = msg.key.participant || msg.key.remoteJid;
            
            // Don't allow demoting yourself
            if (userToDemote === sender) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ You cannot demote yourself!'
                }, { quoted: msg });
                return;
            }

            // Check if user is admin
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const userData = groupMetadata.participants.find(p => p.id === userToDemote);
            
            if (!userData?.admin) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ User is not an admin!`
                }, { quoted: msg });
                return;
            }

            // Demote the user
            await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToDemote], 'demote');
            
            const userNumber = userToDemote.split('@')[0];
            await sock.sendMessage(msg.key.remoteJid, {
                text: `📉 @${userNumber} has been demoted from Admin.`,
                mentions: [userToDemote]
            }, { quoted: msg });

        } catch (error) {
            console.error('Demote error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Failed to demote: ${error.message}\n\n` +
                      `Make sure:\n` +
                      `1. I'm admin in group\n` +
                      `2. User is an admin\n` +
                      `3. You have permission`
            }, { quoted: msg });
        }
    }
};