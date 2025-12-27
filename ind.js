// Add this to your SnehαBot class methods
async handleGroupParticipantsUpdate(update) {
    try {
        const { id, participants, action } = update;
        
        // Get group metadata
        const metadata = await this.sock.groupMetadata(id);
        const groupName = metadata.subject;
        const memberCount = metadata.participants.length;
        
        // Load welcome config
        const welcomeConfig = await this.loadWelcomeConfig(id);
        const config = welcomeConfig[id] || {};
        
        // Handle welcome
        if (action === 'add' && config.welcomeEnabled !== false) {
            for (const participant of participants) {
                await this.sendWelcomeMessage(id, participant, groupName, memberCount, config);
            }
        }
        
        // Handle goodbye
        else if (action === 'remove' && config.goodbyeEnabled !== false) {
            for (const participant of participants) {
                await this.sendGoodbyeMessage(id, participant, groupName, memberCount, config);
            }
        }
        
    } catch (error) {
        console.error('Group participants update error:', error);
    }
}

async loadWelcomeConfig(groupId) {
    try {
        const fs = require('fs').promises;
        const path = require('path');
        const CONFIG_FILE = path.join(__dirname, '../data/welcome-config.json');
        
        await fs.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
        
        try {
            const data = await fs.readFile(CONFIG_FILE, 'utf8');
            return JSON.parse(data);
        } catch (e) {
            return {};
        }
    } catch (error) {
        console.error('Config load error:', error);
        return {};
    }
}

async sendWelcomeMessage(groupId, participant, groupName, memberCount, config) {
    try {
        const userNumber = participant.split('@')[0];
        
        // Get message
        let welcomeMessage;
        if (config.customWelcome) {
            welcomeMessage = config.customWelcome
                .replace(/@user/g, `@${userNumber}`)
                .replace(/{group}/g, groupName)
                .replace(/{membercount}/g, memberCount)
                .replace(/{botname}/g, this.config.botName)
                .replace(/{owner}/g, this.config.ownerName)
                .replace(/{prefix}/g, this.config.prefix);
        } else {
            // Default welcome messages
            const defaultMessages = [
                `🎉 *WELCOME TO THE GROUP!* 🎉\n\n` +
                `👋 Welcome @${userNumber} to *${groupName}*!\n` +
                `🤖 I'm ${this.config.botName}, your friendly assistant.\n` +
                `👥 Members: ${memberCount}\n\n` +
                `💡 *Get started:*\n` +
                `• Type ${this.config.prefix}menu for commands\n` +
                `• Be respectful to everyone\n` +
                `• Enjoy your stay! 🥳\n\n` +
                `👑 Owner: ${this.config.ownerName}`,
                
                `🌟 *NEW MEMBER ALERT!* 🌟\n\n` +
                `A warm welcome to @${userNumber}!\n` +
                `You've joined: ${groupName}\n` +
                `Total members: ${memberCount}\n\n` +
                `🕊🦋⃝♥⃝ѕиєнα🍁♥⃝🦋⃝🕊 says: Welcome da! 😊\n\n` +
                `Need help? Type ${this.config.prefix}help`,
                
                `🚀 *WELCOME ABOARD!* 🚀\n\n` +
                `Hey @${userNumber}! 👋\n` +
                `Glad to have you in ${groupName}!\n` +
                `We're now ${memberCount} members strong! 💪\n\n` +
                `🤖 *Bot Commands:*\n` +
                `${this.config.prefix}menu - See all features\n` +
                `${this.config.prefix}owner - Contact info\n` +
                `${this.config.prefix}rules - Group rules\n\n` +
                `Have a great time! 🎊`
            ];
            
            welcomeMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
        }
        
        // Send message
        await this.sock.sendMessage(groupId, {
            text: welcomeMessage,
            mentions: [participant]
        });
        
        // Send image if configured
        if (config.welcomeImage) {
            setTimeout(async () => {
                try {
                    await this.sock.sendMessage(groupId, {
                        image: { url: config.welcomeImage },
                        caption: `🖼️ Welcome to ${groupName}!`
                    });
                } catch (imageError) {
                    console.error('Welcome image error:', imageError);
                }
            }, 500);
        }
        
    } catch (error) {
        console.error('Welcome message error:', error);
    }
}

async sendGoodbyeMessage(groupId, participant, groupName, memberCount, config) {
    try {
        const userNumber = participant.split('@')[0];
        
        // Get message
        let goodbyeMessage;
        if (config.customGoodbye) {
            goodbyeMessage = config.customGoodbye
                .replace(/@user/g, `@${userNumber}`)
                .replace(/{group}/g, groupName)
                .replace(/{membercount}/g, memberCount)
                .replace(/{botname}/g, this.config.botName)
                .replace(/{owner}/g, this.config.ownerName)
                .replace(/{prefix}/g, this.config.prefix);
        } else {
            // Default goodbye messages
            const defaultMessages = [
                `👋 *GOODBYE!* 👋\n\n` +
                `@${userNumber} has left *${groupName}*\n` +
                `We're now ${memberCount} members\n` +
                `We'll miss you! 😔\n\n` +
                `Hope to see you again someday! ❤️`,
                
                `🚪 *MEMBER LEFT* 🚪\n\n` +
                `Farewell @${userNumber}!\n` +
                `Thanks for being part of ${groupName}\n` +
                `Members remaining: ${memberCount}\n\n` +
                `Take care! 👋`,
                
                `🌅 *SEE YOU LATER!* 🌅\n\n` +
                `@${userNumber} has left the group\n` +
                `Members: ${memberCount}\n` +
                `Wishing you all the best! ✨\n\n` +
                `${this.config.botName} will miss you!`
            ];
            
            goodbyeMessage = defaultMessages[Math.floor(Math.random() * defaultMessages.length)];
        }
        
        await this.sock.sendMessage(groupId, {
            text: goodbyeMessage,
            mentions: [participant]
        });
        
    } catch (error) {
        console.error('Goodbye message error:', error);
    }
}