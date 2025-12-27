module.exports = {
    name: 'groupname',
    alias: ['gname', 'setname', 'ഗ്രൂപ്പ്പേര്'],
    desc: 'Change group name',
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
            const newName = args.join(' ');
            
            if (!newName || newName.length < 2) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `❌ Please provide a valid group name!\n\n` +
                          `Usage: ${config.prefix}groupname [New Group Name]\n` +
                          `Example: ${config.prefix}groupname SNEHA Family`
                }, { quoted: msg });
                return;
            }

            if (newName.length > 100) {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: '❌ Group name too long! Max 100 characters.'
                }, { quoted: msg });
                return;
            }

            // Get current name
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const oldName = groupMetadata.subject;
            
            // Update group name
            await sock.groupUpdateSubject(msg.key.remoteJid, newName);
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: `✅ Group name updated!\n\n` +
                      `📛 Old: ${oldName}\n` +
                      `🏷️ New: ${newName}\n\n` +
                      `Changed by: @${(msg.key.participant || msg.key.remoteJid).split('@')[0]}`
            }, { quoted: msg });

        } catch (error) {
            console.error('Groupname error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Failed to change group name: ${error.message}`
            }, { quoted: msg });
        }
    }
};