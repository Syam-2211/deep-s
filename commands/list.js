module.exports = {
    name: 'list',
    alias: ['members', 'participants', 'ലിസ്റ്റ്'],
    desc: 'Show group members list',
    category: 'group',
    execute: async (sock, msg, args) => {
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        if (!isGroup) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ This command only works in groups!'
            }, { quoted: msg });
            return;
        }
        
        try {
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const participants = groupMetadata.participants;
            
            let memberList = `👥 *GROUP MEMBERS*\n\n`;
            memberList += `📛 Group: ${groupMetadata.subject}\n`;
            memberList += `👥 Total: ${participants.length} members\n\n`;
            
            participants.forEach((participant, index) => {
                const num = participant.id.split('@')[0];
                const name = participant.notify || `User${index + 1}`;
                const admin = participant.admin ? ' 👑' : '';
                memberList += `${index + 1}. ${name} (${num})${admin}\n`;
            });
            
            // Split if too long (WhatsApp limit ~4096 chars)
            if (memberList.length > 4000) {
                memberList = memberList.substring(0, 4000) + '\n\n... (list truncated)';
            }
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: memberList
            }, { quoted: msg });
            
        } catch (error) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Error fetching members: ${error.message}`
            }, { quoted: msg });
        }
    }
};