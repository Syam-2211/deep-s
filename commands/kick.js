module.exports = {
    name: 'kick',
    alias: ['remove', 'purath', 'പുറത്താക്കുക'],
    desc: 'Remove member from group',
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
            // Check if user mentioned someone
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid;
            const mentioned = quoted || (args[0]?.includes('@') ? [args[0]] : null);
            
            if (!mentioned || mentioned.length === 0) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Please mention a user to kick!\n\n` +
                          `Usage:\n` +
                          `${config.prefix}kick @user\n` +
                          `${config.prefix}kick 919876543210\n` +
                          `Or reply to user's message with ${config.prefix}kick`
                }, { quoted: msg });
                return;
            }

            const userToKick = mentioned[0];
            
            // Don't allow kicking yourself or bot
            if (userToKick === msg.key.participant || userToKick === sock.user.id) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ You cannot kick yourself or the bot!'
                }, { quoted: msg });
                return;
            }

            // Remove the user
            await sock.groupParticipantsUpdate(msg.key.remoteJid, [userToKick], 'remove');
            
            const userNumber = userToKick.split('@')[0];
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ User @${userNumber} has been removed from the group!`,
                mentions: [userToKick]
            }, { quoted: msg });

        } catch (error) {
            console.error('Kick error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Failed to remove user: ${error.message}\n\n` +
                      `Make sure:\n` +
                      `1. I'm admin in group\n` +
                      `2. User is in the group\n` +
                      `3. You're admin`
            }, { quoted: msg });
        }
    }
};