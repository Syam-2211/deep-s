// index.js - Main bot file for 🕊🦋⃝♥⃝ѕиєнα🍁♥⃝🦋⃝🕊
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('baileys');
const { Boom } = require('@hapi/boom');
const fs = require('fs');
const path = require('path');
const P = require('pino');

// Custom Configuration
const config = {
    botName: "🕊🦋⃝♥⃝ѕиєнα🍁♥⃝🦋⃝🕊",
    ownerName: "複| xʏEᴍツ",
    ownerNumber: "919947121619",
    prefix: ".",
    sessionName: "snehα-session",
    language: "Manglish",
    usePairingCode: true  // Enable pairing code instead of QR
};

// Command Handler Setup
const commands = new Map();
const aliases = new Map();

// Load all commands from commands folder
function loadCommands() {
    const commandsDir = path.join(__dirname, 'commands');
    
    if (!fs.existsSync(commandsDir)) {
        fs.mkdirSync(commandsDir, { recursive: true });
        console.log('📁 Created commands directory');
    }
    
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    
    for (const file of commandFiles) {
        try {
            const command = require(path.join(commandsDir, file));
            commands.set(command.name, command);
            
            // Register aliases
            if (command.alias && Array.isArray(command.alias)) {
                command.alias.forEach(alias => {
                    aliases.set(alias, command.name);
                });
            }
            
            console.log(`✅ Loaded command: ${command.name}`);
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
        }
    }
    
    console.log(`📊 Total commands loaded: ${commands.size}`);
}

// Message Processor
function processMessage(msg) {
    if (!msg.message) return null;
    
    let text = '';
    let isMedia = false;
    let isQuoted = false;
    let quotedMsg = null;
    
    // Extract text from different message types
    if (msg.message.conversation) {
        text = msg.message.conversation;
    } else if (msg.message.extendedTextMessage) {
        text = msg.message.extendedTextMessage.text || '';
        if (msg.message.extendedTextMessage.contextInfo) {
            isQuoted = true;
            quotedMsg = msg.message.extendedTextMessage.contextInfo;
        }
    } else if (msg.message.imageMessage) {
        text = msg.message.imageMessage.caption || '';
        isMedia = true;
    } else if (msg.message.videoMessage) {
        text = msg.message.videoMessage.caption || '';
        isMedia = true;
    } else if (msg.message.documentMessage) {
        text = msg.message.documentMessage.caption || '';
        isMedia = true;
    }
    
    return { text, isMedia, isQuoted, quotedMsg, sender: msg.key.remoteJid };
}

// Main bot class
class SnehαBot {
    constructor() {
        this.sock = null;
        this.isConnected = false;
        this.startTime = Date.now();
        this.userMessages = new Map(); // For rate limiting
        this.welcomeConfig = {}; // Store welcome/goodbye configs
        this.config = config; // Make config accessible to methods
    }

    // ==================== WELCOME/GOODBYE SYSTEM ====================

    // Save welcome config to JSON file
    async saveWelcomeConfig(groupId, newConfig) {
        try {
            const CONFIG_FILE = path.join(__dirname, 'data/welcome-config.json');
            
            // Create data directory if it doesn't exist
            await fs.promises.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
            
            let allConfig = {};
            try {
                const data = await fs.promises.readFile(CONFIG_FILE, 'utf8');
                allConfig = JSON.parse(data);
            } catch (e) {
                // File doesn't exist, start fresh
                allConfig = {};
            }
            
            // Merge new config with existing
            allConfig[groupId] = { ...allConfig[groupId], ...newConfig };
            
            // Save to file
            await fs.promises.writeFile(CONFIG_FILE, JSON.stringify(allConfig, null, 2));
            
            // Update in-memory config
            this.welcomeConfig = allConfig;
            
            console.log(`✅ Saved welcome config for group: ${groupId}`);
            return true;
        } catch (error) {
            console.error('❌ Save config error:', error);
            return false;
        }
    }
    
    // Load welcome config from JSON file
    async loadWelcomeConfig() {
        try {
            const CONFIG_FILE = path.join(__dirname, 'data/welcome-config.json');
            
            // Create data directory if it doesn't exist
            await fs.promises.mkdir(path.dirname(CONFIG_FILE), { recursive: true });
            
            let allConfig = {};
            try {
                const data = await fs.promises.readFile(CONFIG_FILE, 'utf8');
                allConfig = JSON.parse(data);
            } catch (e) {
                // File doesn't exist, return empty
                allConfig = {};
            }
            
            this.welcomeConfig = allConfig;
            return allConfig;
        } catch (error) {
            console.error('❌ Load config error:', error);
            return {};
        }
    }
    
    // Handle group participant updates (welcome/goodbye)
    async handleGroupUpdate(update) {
        try {
            const { id, participants, action } = update;
            
            // Get group metadata
            const metadata = await this.sock.groupMetadata(id);
            const groupName = metadata.subject;
            const memberCount = metadata.participants.length;
            
            // Load welcome config for this group
            const config = await this.loadWelcomeConfig();
            const groupConfig = config[id] || {};
            
            console.log(`👥 Group update: ${action} in ${groupName}`);
            
            // Handle welcome (default is enabled)
            if (action === 'add' && groupConfig.welcomeEnabled !== false) {
                for (const participant of participants) {
                    await this.sendWelcomeMessage(id, participant, groupName, memberCount, groupConfig);
                }
            }
            
            // Handle goodbye (default is enabled)
            else if (action === 'remove' && groupConfig.goodbyeEnabled !== false) {
                for (const participant of participants) {
                    await this.sendGoodbyeMessage(id, participant, groupName, memberCount, groupConfig);
                }
            }
            
        } catch (error) {
            console.error('❌ Group participants update error:', error);
        }
    }
    
    // Send welcome message
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
            
            console.log(`👋 Sent welcome to @${userNumber} in ${groupName}`);
            
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
            console.error('❌ Welcome message error:', error);
        }
    }
    
    // Send goodbye message
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
            
            console.log(`👋 Sent goodbye to @${userNumber} from ${groupName}`);
            
        } catch (error) {
            console.error('❌ Goodbye message error:', error);
        }
    }

    // ==================== BOT INITIALIZATION ====================

    // Initialize bot
    async initialize() {
        console.log(`🚀 Starting ${config.botName}...`);
        console.log(`👑 Owner: ${config.ownerName}`);
        console.log(`🔢 Number: ${config.ownerNumber}`);
        
        // Load commands
        loadCommands();
        
        // Load welcome configs
        await this.loadWelcomeConfig();
        
        // Load authentication state
        const { state, saveCreds } = await useMultiFileAuthState(config.sessionName);
        
        // Connect to WhatsApp
        const { version } = await fetchLatestBaileysVersion();

        const socketOptions = {
            version,
            logger: P({ level: 'silent' }), // Reduce logs
            auth: state,
            browser: [config.botName, 'Chrome', '1.0.0'],
            markOnlineOnConnect: true,
            syncFullHistory: false,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                return {
                    conversation: "Message unavailable"
                };
            }
        };

        // Add pairing code support if enabled
        if (config.usePairingCode) {
            socketOptions.phoneNumber = config.ownerNumber;
            console.log('🔢 Using pairing code authentication...');
        }

        this.sock = makeWASocket(socketOptions);

        // Event handlers
        this.setupEventHandlers(saveCreds);
        
        // Auto-reconnect
        setInterval(() => {
            if (!this.isConnected) {
                console.log('🔁 Attempting auto-reconnect...');
                this.initialize();
            }
        }, 30000);
    }

    setupEventHandlers(saveCreds) {
        // Connection updates
        this.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr, pairingCode } = update;

            // Display pairing code if available and enabled
            if (pairingCode && config.usePairingCode) {
                console.log('\n\n🔢 PAIRING CODE FOR WHATSAPP:');
                console.log('=====================================');
                console.log(pairingCode);
                console.log('=====================================');
                console.log('📱 Open WhatsApp on your phone');
                console.log('📱 Go to Linked Devices > Link a Device');
                console.log('📱 Enter the 8-digit code above');
                console.log('⚠️  Code expires in 60 seconds\n\n');
            }
            // Display QR code if available (fallback)
            else if (qr) {
                console.log('\n\n🟢 SCAN THIS QR CODE WITH WHATSAPP:');
                console.log('=====================================');

                // Clean QR code - remove all whitespace and ensure it's one continuous string
                const cleanQR = qr.replace(/\s+/g, '').replace(/\n/g, '');
                console.log(cleanQR);

                console.log('=====================================');
                console.log('📱 Open WhatsApp > Linked Devices > Link a Device');
                console.log('⚠️  IMPORTANT: Copy the ENTIRE string between the ===== lines');
                console.log('⚠️  If the QR code doesn\'t scan, paste the string into an online QR generator');
                console.log('⚠️  The QR code should be scanned as one continuous line\n\n');
            }

            if (connection === 'close') {
                this.isConnected = false;
                const statusCode = lastDisconnect?.error?.output?.statusCode;

                if (statusCode === DisconnectReason.loggedOut) {
                    console.log('❌ Logged out. Delete session folder and rescan QR.');
                    fs.rmSync(config.sessionName, { recursive: true, force: true });
                    process.exit(1);
                } else if (statusCode === 401) {
                    console.log('❌ Authentication failed. Rescan QR code.');
                } else {
                    console.log('🔁 Connection closed. Reconnecting in 5s...');
                    setTimeout(() => this.initialize(), 5000);
                }
            } else if (connection === 'open') {
                this.isConnected = true;
                console.log(`✅ ${config.botName} connected successfully!`);
                await this.setBotStatus();
                await this.sendOwnerAlert();
            }
        });

        // New messages
        this.sock.ev.on('messages.upsert', async ({ messages }) => {
            const msg = messages[0];
            if (msg.key.fromMe) return;
            
            await this.handleMessage(msg);
        });

        // Credentials update
        this.sock.ev.on('creds.update', saveCreds);

        // Group updates (WELCOME/GOODBYE)
        this.sock.ev.on('group-participants.update', async (update) => {
            await this.handleGroupUpdate(update);
        });

        // Message receipts
        this.sock.ev.on('message-receipt.update', (updates) => {
            // Track message delivery
        });
    }

    // Set bot status
    async setBotStatus() {
        try {
            await this.sock.updateProfileStatus(`🤖 ${config.botName} | Online`);
            await this.sock.updateProfileName(config.botName);
            console.log('✅ Bot status updated');
        } catch (error) {
            console.log('⚠️ Could not update bot status:', error.message);
        }
    }

    // Send alert to owner
    async sendOwnerAlert() {
        try {
            const uptime = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(uptime / 60);
            
            await this.sock.sendMessage(`${config.ownerNumber}@s.whatsapp.net`, {
                text: `🤖 *${config.botName} is Online!*\n\n` +
                      `⏰ Uptime: ${minutes} minutes\n` +
                      `📊 Commands: ${commands.size}\n` +
                      `🌐 Multi-Device: Active\n` +
                      `👋 Welcome System: Enabled ✅\n` +
                      `✅ Ready to serve!\n\n` +
                      `Type ${config.prefix}menu for commands`
            });
        } catch (error) {
            console.log('⚠️ Could not send owner alert');
        }
    }

    // Handle incoming messages
    async handleMessage(msg) {
        const processed = processMessage(msg);
        if (!processed) return;
        
        const { text, sender, isMedia, isQuoted } = processed;
        const senderNumber = sender.split('@')[0];
        
        // Rate limiting
        if (!this.checkRateLimit(sender)) return;
        
        // Log message
        console.log(`📨 [${senderNumber}]: ${text.substring(0, 50)}${text.length > 50 ? '...' : ''}`);
        
        // Check if message starts with prefix
        if (text.startsWith(config.prefix)) {
            await this.handleCommand(text, msg, sender, isMedia, isQuoted);
        } else {
            // Handle non-command messages (auto-reply, AI chat, etc.)
            await this.handleRegularMessage(text, msg, sender);
        }
    }

    // Handle commands
    async handleCommand(fullCommand, originalMsg, sender, isMedia, isQuoted) {
        // Remove prefix and parse
        const args = fullCommand.slice(config.prefix.length).trim().split(/\s+/);
        const commandName = args.shift().toLowerCase();
        
        // Check if command exists
        let command = commands.get(commandName) || commands.get(aliases.get(commandName));
        
        if (!command) {
            // Command not found
            await this.sock.sendMessage(sender, {
                text: `❌ Command "${config.prefix}${commandName}" not found.\n` +
                      `Type ${config.prefix}menu to see all commands.`
            }, { quoted: originalMsg });
            return;
        }
        
        // Check if command requires media but none provided
        if (command.requireMedia && !isMedia && !isQuoted) {
            await this.sock.sendMessage(sender, {
                text: `📸 This command requires an image/video.\n` +
                      `Please reply to media with ${config.prefix}${command.name}`
            }, { quoted: originalMsg });
            return;
        }
        
        // Check if command is admin-only
        if (command.adminOnly && !this.isAdmin(sender)) {
            await this.sock.sendMessage(sender, {
                text: `⛔ This command is for admins only.\n` +
                      `Contact ${config.ownerName} for access.`
            }, { quoted: originalMsg });
            return;
        }
        
        // Execute command
        try {
            console.log(`⚡ Executing: ${config.prefix}${command.name}`);
            
            await command.execute(this.sock, originalMsg, args, {
                config,
                commands,
                isMedia,
                isQuoted,
                bot: this  // ← PASS BOT INSTANCE TO COMMANDS
            });
            
        } catch (error) {
            console.error(`❌ Error executing ${commandName}:`, error);
            
            await this.sock.sendMessage(sender, {
                text: `⚠️ Error executing command:\n${error.message}\n\n` +
                      `Contact ${config.ownerName} if issue persists.`
            }, { quoted: originalMsg });
        }
    }

    // Handle regular messages (non-commands)
    async handleRegularMessage(text, originalMsg, sender) {
        // Auto-reply for greetings
        const greetings = ['hi', 'hello', 'hey', 'hai', 'vanakkam', 'namaste', 'hola'];
        const lowerText = text.toLowerCase();
        
        if (greetings.some(greet => lowerText.includes(greet))) {
            await this.sock.sendMessage(sender, {
                text: config.language === 'Manglish' ?
                    `Hello da! 👋\nEntha vishesham? Type ${config.prefix}menu for commands.` :
                    `Hello! 👋\nHow can I help? Type ${config.prefix}menu for commands.`
            }, { quoted: originalMsg });
            return;
        }
        
        // Auto-reply for bot mentions
        if (lowerText.includes('bot') || lowerText.includes(config.botName.toLowerCase().replace(/[^a-z0-9]/gi, ''))) {
            await this.sock.sendMessage(sender, {
                text: config.language === 'Manglish' ?
                    `Yes, I'm ${config.botName}! 🤖\nUse ${config.prefix}menu nokku da!` :
                    `Yes, I'm ${config.botName}! 🤖\nUse ${config.prefix}menu to see my features!`
            }, { quoted: originalMsg });
            return;
        }
        
        // Auto-reply for thanks
        if (lowerText.includes('thanks') || lowerText.includes('thank you') || lowerText.includes('nandi')) {
            await this.sock.sendMessage(sender, {
                text: config.language === 'Manglish' ?
                    `Welcome da! ❤️\nAlways happy to help!` :
                    `You're welcome! ❤️\nAlways happy to help!`
            }, { quoted: originalMsg });
            return;
        }
        
        // If it's a question (ends with ?)
        if (text.trim().endsWith('?')) {
            await this.sock.sendMessage(sender, {
                text: config.language === 'Manglish' ?
                    `Interesting question da! 🤔\nTry ${config.prefix}gpt for AI answers.` :
                    `Interesting question! 🤔\nTry ${config.prefix}gpt for AI answers.`
            }, { quoted: originalMsg });
        }
    }

    // Check if user is admin
    isAdmin(sender) {
        // Owner is always admin
        if (sender === `${config.ownerNumber}@s.whatsapp.net`) return true;
        
        // Add more admin numbers here if needed
        const admins = [
            config.ownerNumber
            // Add more: "919999999999", "918888888888"
        ];
        
        return admins.some(num => sender === `${num}@s.whatsapp.net`);
    }

    // Rate limiting to prevent spam
    checkRateLimit(sender) {
        const now = Date.now();
        const userData = this.userMessages.get(sender) || { count: 0, lastMessage: 0 };
        
        // Reset count if more than 1 minute passed
        if (now - userData.lastMessage > 60000) {
            userData.count = 0;
        }
        
        // Check rate limit (10 messages per minute)
        if (userData.count >= 10) {
            return false;
        }
        
        userData.count++;
        userData.lastMessage = now;
        this.userMessages.set(sender, userData);
        
        return true;
    }

    // Get bot uptime
    getUptime() {
        const uptime = Math.floor((Date.now() - this.startTime) / 1000);
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = uptime % 60;
        
        return `${hours}h ${minutes}m ${seconds}s`;
    }
}

// Essential command files (create these in commands/ folder)
const essentialCommands = {
    // Create ping.js
    'ping.js': `module.exports = {
        name: 'ping',
        alias: ['speed', 'test'],
        desc: 'Check bot response speed',
        category: 'general',
        execute: async (sock, msg, args, { config, bot }) => {
            const start = Date.now();
            await sock.sendPresenceUpdate('available', msg.key.remoteJid);
            const latency = Date.now() - start;
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: \`🏓 Pong!\\n\` +
                      \`⏱️ Latency: \${latency}ms\\n\` +
                      \`⏰ Uptime: \${bot.getUptime()}\\n\` +
                      \`📊 Commands: \${config.commands.size}\\n\\n\` +
                      (config.language === 'Manglish' ? 
                      \`\${config.botName} speed poli alle! 💪\` :
                      \`\${config.botName} is super fast! 💪\`)
            }, { quoted: msg });
        }
    };`,
    
    // Create owner.js
    'owner.js': `module.exports = {
        name: 'owner',
        alias: ['creator', 'dev', 'ഓണർ'],
        desc: 'Show bot owner information',
        category: 'general',
        execute: async (sock, msg, args, { config }) => {
            await sock.sendMessage(msg.key.remoteJid, {
                text: \`👑 *BOT OWNER INFORMATION*\\n\\n\` +
                      \`🤖 Bot: \${config.botName}\\n\` +
                      \`👤 Name: \${config.ownerName}\\n\` +
                      \`📞 Number: \${config.ownerNumber}\\n\` +
                      \`💬 WhatsApp: wa.me/\${config.ownerNumber}\\n\\n\` +
                      \`Contact for queries/support! ❤️\`
            }, { quoted: msg });
        }
    };`,
    
    // Create info.js
    'info.js': `module.exports = {
        name: 'info',
        alias: ['about', 'botinfo', 'വിവരങ്ങൾ'],
        desc: 'Show bot information',
        category: 'general',
        execute: async (sock, msg, args, { config, bot }) => {
            const uptime = bot.getUptime();
            const memory = Math.round(process.memoryUsage().rss / 1024 / 1024);
            
            await sock.sendMessage(msg.key.remoteJid, {
                text: \`\${config.botName} *BOT INFORMATION*\\n\\n\` +
                      \`📛 Name: \${config.botName}\\n\` +
                      \`👑 Owner: \${config.ownerName}\\n\` +
                      \`🔢 Number: \${config.ownerNumber}\\n\` +
                      \`⏰ Uptime: \${uptime}\\n\` +
                      \`💾 Memory: \${memory} MB\\n\` +
                      \`📊 Commands: \${config.commands.size}\\n\` +
                      \`🌐 Multi-Device: Yes ✅\\n\` +
                      \`👋 Welcome System: Enabled ✅\\n\` +
                      \`💬 Prefix: \${config.prefix}\\n\\n\` +
                      \`Powered by @whapi/baileys 🚀\`
            }, { quoted: msg });
        }
    };`
};

// Create essential command files if they don't exist
function createEssentialCommands() {
    const commandsDir = path.join(__dirname, 'commands');
    
    if (!fs.existsSync(commandsDir)) {
        fs.mkdirSync(commandsDir, { recursive: true });
    }
    
    Object.entries(essentialCommands).forEach(([filename, content]) => {
        const filepath = path.join(commandsDir, filename);
        
        if (!fs.existsSync(filepath)) {
            fs.writeFileSync(filepath, content);
            console.log(`📝 Created essential command: ${filename}`);
        }
    });
}

// Start the bot
async function startBot() {
    try {
        // Create essential commands
        createEssentialCommands();
        
        // Create session directory
        if (!fs.existsSync(config.sessionName)) {
            fs.mkdirSync(config.sessionName, { recursive: true });
        }
        
        // Create data directory for welcome config
        if (!fs.existsSync('data')) {
            fs.mkdirSync('data', { recursive: true });
            console.log('📁 Created data directory for welcome config');
        }
        
        // Initialize bot
        const bot = new SnehαBot();
        await bot.initialize();
        
        // Handle process exit
        process.on('SIGINT', async () => {
            console.log(`\n👋 Shutting down ${config.botName}...`);
            
            if (bot.sock) {
                await bot.sock.end();
            }
            
            process.exit(0);
        });
        
    } catch (error) {
        console.error('❌ Failed to start bot:', error);
        process.exit(1);
    }
}

// Start the bot
startBot();

// Export for testing
module.exports = { SnehαBot, config };