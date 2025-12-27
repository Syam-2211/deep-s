module.exports = {
    name: 'tagall',
    alias: ['mention', 'everyone', 'callall', 'ടാഗ്ആൽ'],
    desc: 'Advanced group mention with options',
    category: 'group',
    execute: async (sock, msg, args, { config }) => {
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        if (!isGroup) {
            return await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ *Group Command Only!*\nThis command works only in groups.'
            }, { quoted: msg });
        }

        try {
            // Get group info
            const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
            const participants = groupMetadata.participants;
            const sender = msg.key.participant || msg.key.remoteJid;
            
            // Check admin permission
            const senderParticipant = participants.find(p => p.id === sender);
            if (!senderParticipant?.admin) {
                return await sock.sendMessage(msg.key.remoteJid, {
                    text: '⛔ *Admin Only!*\nYou need to be a group admin to use this command.'
                }, { quoted: msg });
            }

            // Parse arguments
            const [action, ...messageParts] = args;
            const customMessage = messageParts.join(' ') || 'Attention please! 🎯';
            
            // Different tag styles
            let tagMessage = '';
            let mentions = [];
            
            if (action === 'admin' || action === 'admins') {
                // Tag only admins
                const admins = participants.filter(p => p.admin);
                mentions = admins.map(p => p.id);
                
                tagMessage = `👑 *ADMIN MEETING!* 👑\n\n`;
                tagMessage += `📢 ${customMessage}\n\n`;
                tagMessage += `*Admins Only:*\n`;
                admins.forEach((admin, index) => {
                    const number = admin.id.split('@')[0];
                    const name = admin.notify || `Admin${index + 1}`;
                    tagMessage += `👑 ${index + 1}. @${number}\n`;
                });
                tagMessage += `\nTotal Admins: ${admins.length}`;
                
            } else if (action === 'random' || action === 'some') {
                // Tag random 5 members
                const randomCount = parseInt(messageParts[0]) || 5;
                const shuffled = [...participants].sort(() => 0.5 - Math.random());
                const randomMembers = shuffled.slice(0, Math.min(randomCount, participants.length));
                mentions = randomMembers.map(p => p.id);
                
                tagMessage = `🎲 *RANDOM SELECTION!* 🎲\n\n`;
                tagMessage += `📢 ${customMessage}\n\n`;
                tagMessage += `*Randomly Selected:*\n`;
                randomMembers.forEach((member, index) => {
                    const number = member.id.split('@')[0];
                    const name = member.notify || `User${index + 1}`;
                    const badge = member.admin ? ' 👑' : '';
                    tagMessage += `🎯 ${index + 1}. @${number}${badge}\n`;
                });
                tagMessage += `\nSelected: ${randomMembers.length}/${participants.length}`;
                
            } else if (action === 'silent' || action === 'hidetag') {
                // Hidden tag (no notification)
                mentions = participants.map(p => p.id);
                
                tagMessage = `👁️ *SILENT ANNOUNCEMENT* 👁️\n\n`;
                tagMessage += `${customMessage}\n\n`;
                tagMessage += `📌 *No notifications sent*\n`;
                tagMessage += `👥 Total Members: ${participants.length}\n`;
                tagMessage += `👤 Posted by: @${sender.split('@')[0]}`;
                
            } else {
                // Normal tag all
                mentions = participants.map(p => p.id);
                
                tagMessage = `📢 *GROUP ANNOUNCEMENT* 📢\n\n`;
                tagMessage += `${customMessage}\n\n`;
                tagMessage += `*Mentioned Members:*\n`;
                
                // Group by admin status
                const admins = participants.filter(p => p.admin);
                const members = participants.filter(p => !p.admin);
                
                if (admins.length > 0) {
                    tagMessage += `\n👑 *ADMINS (${admins.length}):*\n`;
                    admins.forEach((admin, index) => {
                        const number = admin.id.split('@')[0];
                        const name = admin.notify || `Admin${index + 1}`;
                        tagMessage += `${index + 1}. @${number}\n`;
                    });
                }
                
                if (members.length > 0) {
                    tagMessage += `\n👥 *MEMBERS (${members.length}):*\n`;
                    members.forEach((member, index) => {
                        const number = member.id.split('@')[0];
                        const name = member.notify || `User${index + 1}`;
                        tagMessage += `${index + 1}. @${number}\n`;
                    });
                }
                
                tagMessage += `\n📊 Total: ${participants.length} members`;
                tagMessage += `\n👤 Announced by: @${sender.split('@')[0]}`;
            }
            
            // Send the tagged message
            await sock.sendMessage(msg.key.remoteJid, {
                text: tagMessage,
                mentions: mentions
            }, { quoted: msg });
            
            // Send usage guide
            setTimeout(async () => {
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `📖 *TAGALL USAGE GUIDE*\n\n` +
                          `${config.prefix}tagall [message] - Tag everyone\n` +
                          `${config.prefix}tagall admin [message] - Tag only admins\n` +
                          `${config.prefix}tagall random [count] - Tag random members\n` +
                          `${config.prefix}tagall silent [message] - Hidden tag\n\n` +
                          `👑 Admin permission required`
                });
            }, 1000);
            
        } catch (error) {
            console.error('Tagall error:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Error: ${error.message}\n\n` +
                      `Make sure:\n` +
                      `1. I'm added as admin in group\n` +
                      `2. You're a group admin\n` +
                      `3. Group has members`
            }, { quoted: msg });
        }
    }
};