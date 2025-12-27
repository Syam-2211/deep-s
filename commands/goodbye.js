module.exports = {
    name: 'goodbye',
    alias: ['setgoodbye', 'leave', 'വിട'],
    desc: 'Configure goodbye messages',
    category: 'group',
    adminOnly: true,
    execute: async (sock, msg, args, { config, bot }) => {
        const isGroup = msg.key.remoteJid.endsWith('@g.us');
        
        if (!isGroup) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: '❌ This command only works in groups!'
            }, { quoted: msg });
            return;
        }
        
        const action = args[0]?.toLowerCase();
        
        switch(action) {
            case 'on':
            case 'enable':
                // Enable goodbye messages
                if (bot && bot.saveWelcomeConfig) {
                    await bot.saveWelcomeConfig(msg.key.remoteJid, { 
                        goodbyeEnabled: true 
                    });
                }
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `✅ *Goodbye messages enabled!*\n\n` +
                          `When members leave, they'll get a farewell message.\n\n` +
                          `To set custom message:\n` +
                          `.goodbye set [message]\n\n` +
                          `Variables: @user, {group}, {membercount}, {botname}, {owner}, {prefix}`
                }, { quoted: msg });
                break;
                
            case 'off':
            case 'disable':
                // Disable goodbye messages
                if (bot && bot.saveWelcomeConfig) {
                    await bot.saveWelcomeConfig(msg.key.remoteJid, { 
                        goodbyeEnabled: false 
                    });
                }
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `🔇 *Goodbye messages disabled!*\n\n` +
                          `No messages when members leave.\n\n` +
                          `To enable: ${config.prefix}goodbye on`
                }, { quoted: msg });
                break;
                
            case 'set':
                const customMessage = args.slice(1).join(' ');
                if (!customMessage) {
                    await sock.sendMessage(msg.key.remoteJid, {
                        text: `❌ Please provide a goodbye message!\n\n` +
                              `Usage: .goodbye set [message]\n\n` +
                              `Example:\n` +
                              `.goodbye set Goodbye @user from {group}!`
                    }, { quoted: msg });
                    return;
                }
                
                // Save custom goodbye message
                if (bot && bot.saveWelcomeConfig) {
                    await bot.saveWelcomeConfig(msg.key.remoteJid, {
                        customGoodbye: customMessage,
                        goodbyeEnabled: true
                    });
                }
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `✅ *Custom goodbye message set!*\n\n` +
                          `📝 Message:\n"${customMessage}"\n\n` +
                          `Available variables:\n` +
                          `• @user - Mentions leaving member\n` +
                          `• {group} - Group name\n` +
                          `• {membercount} - Member count\n` +
                          `• {botname} - Bot name\n` +
                          `• {owner} - Owner name\n` +
                          `• {prefix} - Bot prefix\n\n` +
                          `Next time someone leaves, they'll see this message!`
                }, { quoted: msg });
                break;
                
            case 'test':
                const userNumber = msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0];
                const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
                const groupName = groupMetadata.subject;
                const memberCount = groupMetadata.participants.length;
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `👋 *GOODBYE TEST*\n\n` +
                          `@${userNumber} has left *${groupName}*\n` +
                          `We're now ${memberCount} members\n` +
                          `We'll miss you! 😔\n\n` +
                          `(This is a test message)`,
                    mentions: [msg.key.participant || msg.key.remoteJid]
                }, { quoted: msg });
                break;
                
            case 'view':
                // Show goodbye config
                const groupId = msg.key.remoteJid;
                let goodbyeEnabled = true;
                let customGoodbye = null;
                
                if (bot && bot.loadWelcomeConfig) {
                    const configs = await bot.loadWelcomeConfig();
                    const groupConfig = configs[groupId] || {};
                    goodbyeEnabled = groupConfig.goodbyeEnabled !== false;
                    customGoodbye = groupConfig.customGoodbye;
                }
                
                let response = `⚙️ *GOODBYE SYSTEM CONFIG*\n\n`;
                response += `✅ Status: ${goodbyeEnabled ? 'Enabled' : 'Disabled'}\n`;
                response += `📝 Custom message: ${customGoodbye ? 'Yes' : 'No (using default)'}\n\n`;
                
                if (customGoodbye) {
                    response += `📋 Custom message preview:\n"${customGoodbye.substring(0, 100)}${customGoodbye.length > 100 ? '...' : ''}"\n\n`;
                }
                
                response += `💡 Commands:\n`;
                response += `.goodbye on - Enable\n`;
                response += `.goodbye off - Disable\n`;
                response += `.goodbye test - Test\n`;
                response += `.goodbye set [msg] - Custom message\n\n`;
                response += `Settings apply to this group only.`;
                
                await sock.sendMessage(msg.key.remoteJid, {
                    text: response
                }, { quoted: msg });
                break;
                
            default:
                await sock.sendMessage(msg.key.remoteJid, {
                    text: `👋 *GOODBYE SYSTEM*\n\n` +
                          `Commands:\n` +
                          `${config.prefix}goodbye on - Enable\n` +
                          `${config.prefix}goodbye off - Disable\n` +
                          `${config.prefix}goodbye test - Test\n` +
                          `${config.prefix}goodbye set [msg] - Custom message\n` +
                          `${config.prefix}goodbye view - View settings\n\n` +
                          `⚙️ Variables:\n` +
                          `• @user - Mentions leaving member\n` +
                          `• {group} - Group name\n` +
                          `• {membercount} - Member count\n` +
                          `• {botname} - Bot name\n` +
                          `• {owner} - Owner name\n` +
                          `• {prefix} - Bot prefix\n\n` +
                          `Settings apply to this group only.\n` +
                          `👑 Admin permission required`
                }, { quoted: msg });
        }
    }
};