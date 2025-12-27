module.exports = {
    name: 'welcome',
    alias: ['setwelcome', 'welcomeconfig', 'സ്വാഗതം'],
    desc: 'Configure welcome messages',
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
                await enableWelcome(sock, msg, args.slice(1), bot);
                break;
                
            case 'off':
            case 'disable':
                await disableWelcome(sock, msg, bot);
                break;
                
            case 'test':
                await testWelcome(sock, msg, args.slice(1), config);
                break;
                
            case 'set':
                await setWelcomeMessage(sock, msg, args.slice(1), bot);
                break;
                
            case 'view':
            case 'show':
                await showWelcomeConfig(sock, msg, bot);
                break;
                
            default:
                await showWelcomeHelp(sock, msg, config);
        }
    }
};

async function enableWelcome(sock, msg, args, bot) {
    const customMessage = args.join(' ');
    const groupId = msg.key.remoteJid;
    
    let response = `✅ *Welcome messages enabled!*\n\n`;
    
    if (customMessage) {
        // Save custom message to config
        if (bot && bot.saveWelcomeConfig) {
            await bot.saveWelcomeConfig(groupId, {
                welcomeEnabled: true,
                customWelcome: customMessage
            });
        }
        
        response += `📝 Custom message set:\n"${customMessage}"\n\n`;
        response += `Variables you can use:\n`;
        response += `• @user - Mentions new member\n`;
        response += `• {group} - Group name\n`;
        response += `• {membercount} - Total members\n`;
        response += `• {botname} - Bot name\n`;
        response += `• {owner} - Owner name\n`;
        response += `• {prefix} - Bot prefix`;
    } else {
        // Enable with default messages
        if (bot && bot.saveWelcomeConfig) {
            await bot.saveWelcomeConfig(groupId, {
                welcomeEnabled: true,
                customWelcome: null
            });
        }
        
        response += `Default welcome messages will be used.\n`;
        response += `New members will be greeted automatically.`;
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: response
    }, { quoted: msg });
}

async function disableWelcome(sock, msg, bot) {
    const groupId = msg.key.remoteJid;
    
    // Disable welcome messages
    if (bot && bot.saveWelcomeConfig) {
        await bot.saveWelcomeConfig(groupId, {
            welcomeEnabled: false
        });
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: `🔇 *Welcome messages disabled!*\n\n` +
              `New members won't receive automatic greetings.\n\n` +
              `To enable again: .welcome on`
    }, { quoted: msg });
}

async function testWelcome(sock, msg, args, config) {
    const userNumber = msg.key.participant?.split('@')[0] || msg.key.remoteJid.split('@')[0];
    const groupMetadata = await sock.groupMetadata(msg.key.remoteJid);
    const groupName = groupMetadata.subject;
    const memberCount = groupMetadata.participants.length;
    
    const testMessage = `🎉 *WELCOME TEST* 🎉\n\n` +
                       `👋 Welcome @${userNumber} to *${groupName}*!\n` +
                       `This is a test welcome message.\n\n` +
                       `🤖 Bot: ${config.botName}\n` +
                       `👑 Owner: ${config.ownerName}\n` +
                       `👥 Members: ${memberCount}\n\n` +
                       `Type ${config.prefix}menu for commands!`;
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: testMessage,
        mentions: [msg.key.participant || msg.key.remoteJid]
    }, { quoted: msg });
}

async function setWelcomeMessage(sock, msg, args, bot) {
    const customMessage = args.join(' ');
    const groupId = msg.key.remoteJid;
    
    if (!customMessage) {
        await sock.sendMessage(msg.key.remoteJid, {
            text: `❌ Please provide a welcome message!\n\n` +
                  `Usage: .welcome set [message]\n\n` +
                  `Example:\n` +
                  `.welcome set Welcome @user to {group}!`
        }, { quoted: msg });
        return;
    }
    
    // Save custom message
    if (bot && bot.saveWelcomeConfig) {
        await bot.saveWelcomeConfig(groupId, {
            customWelcome: customMessage,
            welcomeEnabled: true
        });
    }
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: `✅ *Custom welcome message set!*\n\n` +
              `📝 Message:\n"${customMessage}"\n\n` +
              `Available variables:\n` +
              `• @user - Mentions new member\n` +
              `• {group} - Group name\n` +
              `• {membercount} - Member count\n` +
              `• {botname} - Bot name\n` +
              `• {owner} - Owner name\n` +
              `• {prefix} - Bot prefix\n\n` +
              `Next time someone joins, they'll see this message!`
    }, { quoted: msg });
}

async function showWelcomeConfig(sock, msg, bot) {
    const groupId = msg.key.remoteJid;
    
    // Load current config
    let welcomeEnabled = true;
    let goodbyeEnabled = true;
    let customWelcome = null;
    
    if (bot && bot.loadWelcomeConfig) {
        const config = await bot.loadWelcomeConfig();
        const groupConfig = config[groupId] || {};
        welcomeEnabled = groupConfig.welcomeEnabled !== false;
        goodbyeEnabled = groupConfig.goodbyeEnabled !== false;
        customWelcome = groupConfig.customWelcome;
    }
    
    let response = `⚙️ *WELCOME SYSTEM CONFIG*\n\n`;
    response += `✅ Status: ${welcomeEnabled ? 'Enabled' : 'Disabled'}\n`;
    response += `📝 Custom message: ${customWelcome ? 'Yes' : 'No (using default)'}\n`;
    response += `👋 Goodbye: ${goodbyeEnabled ? 'Enabled' : 'Disabled'}\n\n`;
    
    if (customWelcome) {
        response += `📋 Custom message preview:\n"${customWelcome.substring(0, 100)}${customWelcome.length > 100 ? '...' : ''}"\n\n`;
    }
    
    response += `💡 Commands:\n`;
    response += `.welcome on - Enable welcome\n`;
    response += `.welcome off - Disable welcome\n`;
    response += `.welcome test - Test welcome\n`;
    response += `.welcome set [msg] - Set custom\n`;
    response += `.goodbye on/off - Goodbye settings\n\n`;
    response += `Current settings apply to this group only.`;
    
    await sock.sendMessage(msg.key.remoteJid, {
        text: response
    }, { quoted: msg });
}

async function showWelcomeHelp(sock, msg, config) {
    await sock.sendMessage(msg.key.remoteJid, {
        text: `👋 *WELCOME SYSTEM*\n\n` +
              `Automatically greet new group members!\n\n` +
              `📝 *Commands:*\n` +
              `${config.prefix}welcome on - Enable welcome\n` +
              `${config.prefix}welcome off - Disable welcome\n` +
              `${config.prefix}welcome test - Test welcome\n` +
              `${config.prefix}welcome set [msg] - Custom message\n` +
              `${config.prefix}welcome view - View settings\n\n` +
              `⚙️ *Features:*\n` +
              `• Auto-welcome new members\n` +
              `• Auto-goodbye leaving members\n` +
              `• Customizable messages\n` +
              `• Random messages\n` +
              `• User mentions\n` +
              `• Variables: @user, {group}, {membercount}, etc.\n\n` +
              `👑 Admin permission required`
    }, { quoted: msg });
}