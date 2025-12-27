module.exports = {
    name: 'add',
    alias: ['invite', 'adduser', 'ചേർക്കുക'],
    desc: 'Add member to group',
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
            // Get phone number from args
            let phoneNumber = args[0];
            
            if (!phoneNumber) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Please provide a phone number!\n\n` +
                          `Usage: ${config.prefix}add 919876543210\n` +
                          `Example: ${config.prefix}add 919947121619`
                }, { quoted: msg });
                return;
            }

            // Format phone number
            if (!phoneNumber.startsWith('9')) {
                phoneNumber = '91' + phoneNumber;
            }
            if (!phoneNumber.endsWith('@s.whatsapp.net')) {
                phoneNumber = phoneNumber + '@s.whatsapp.net';
            }

            // Check if already in group
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const isAlreadyMember = groupMetadata.participants.some(p => p.id === phoneNumber);
            
            if (isAlreadyMember) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ User is already in the group!`
                }, { quoted: msg });
                return;
            }

            // Add the user
            await sock.groupParticipantsUpdate(msg.key.remoteJid, [phoneNumber], 'add');
            
            const shortNumber = phoneNumber.split('@')[0];
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Invitation sent to ${shortNumber}!\n` +
                      `They have 72 hours to accept the invite.`
            }, { quoted: msg });

        } catch (error) {
            console.error('Add error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Failed to add user: ${error.message}\n\n` +
                      `Possible reasons:\n` +
                      `1. Invalid phone number\n` +
                      `2. User blocked the bot\n` +
                      `3. Group is full (max 1024)\n` +
                      `4. Privacy settings`
            }, { quoted: msg });
        }
    }
};
