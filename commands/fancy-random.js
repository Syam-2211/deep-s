// This file randomly calls one of your 3 fancy commands
module.exports = {
    name: 'fancy',
    alias: ['font', 'text', 'style', 'stylish', 'ഫാൻസി'],
    desc: 'Random fancy text generator (rotates between 3 styles)',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        try {
            // Load all 3 fancy commands
            const fancy1 = require('./fancy');
            const fancy2 = require('./fancy2');
            const fancy3 = require('./fancy3');
            
            // Store which one was used last (for rotation)
            let lastUsed = getLastUsed();
            
            // Random selection method
            const method = config.fancyRandomMethod || 'random'; // 'random', 'rotate', 'weighted'
            
            let selectedCommand;
            
            switch(method) {
                case 'rotate':
                    // Rotate through commands in order
                    selectedCommand = rotateCommands(lastUsed);
                    break;
                    
                case 'weighted':
                    // Give different weights to each command
                    selectedCommand = weightedRandom();
                    break;
                    
                case 'random':
                default:
                    // Pure random selection
                    selectedCommand = pureRandom();
                    break;
            }
            
            // Execute the selected command
            switch(selectedCommand) {
                case 'fancy1':
                    console.log('🎲 Random selected: fancy.js');
                    await fancy1.execute(sock, msg, args, { config });
                    saveLastUsed('fancy1');
                    break;
                    
                case 'fancy2':
                    console.log('🎲 Random selected: fancy2.js');
                    await fancy2.execute(sock, msg, args, { config });
                    saveLastUsed('fancy2');
                    break;
                    
                case 'fancy3':
                    console.log('🎲 Random selected: fancy3.js');
                    await fancy3.execute(sock, msg, args, { config });
                    saveLastUsed('fancy3');
                    break;
            }
            
        } catch (error) {
            console.error('Error in fancy-random:', error);
            await sock.sendMessage(msg.key.remoteJid, {
                text: `🎲 *Random Fancy Text*\n\n` +
                      `Oops! Random selection failed.\n` +
                      `Try: ${config.prefix}fancy [your text]\n\n` +
                      `Or use specific version:\n` +
                      `${config.prefix}fancy1 - Basic fancy\n` +
                      `${config.prefix}fancy2 - Advanced fancy\n` +
                      `${config.prefix}fancy3 - Interactive fancy`
            }, { quoted: msg });
        }
    }
};

// Helper functions
function getLastUsed() {
    try {
        const fs = require('fs');
        if (fs.existsSync('./fancy-last-used.json')) {
            return JSON.parse(fs.readFileSync('./fancy-last-used.json', 'utf8')).lastUsed;
        }
    } catch (e) {}
    return null;
}

function saveLastUsed(command) {
    try {
        const fs = require('fs');
        fs.writeFileSync('./fancy-last-used.json', 
            JSON.stringify({ lastUsed: command, timestamp: Date.now() }, null, 2));
    } catch (e) {}
}

function rotateCommands(lastUsed) {
    const order = ['fancy1', 'fancy2', 'fancy3'];
    if (!lastUsed) return order[0];
    
    const currentIndex = order.indexOf(lastUsed);
    const nextIndex = (currentIndex + 1) % order.length;
    return order[nextIndex];
}

function pureRandom() {
    const commands = ['fancy1', 'fancy2', 'fancy3'];
    return commands[Math.floor(Math.random() * commands.length)];
}

function weightedRandom() {
    // Give different weights (1: 40%, 2: 35%, 3: 25%)
    const random = Math.random();
    if (random < 0.40) return 'fancy1';  // 40% chance
    if (random < 0.75) return 'fancy2';  // 35% chance
    return 'fancy3';                     // 25% chance
}