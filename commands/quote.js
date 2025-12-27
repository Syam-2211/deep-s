module.exports = {
    name: 'quote',
    alias: ['inspire', 'മൊഴി'],
    desc: 'Get inspirational quotes',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const quotes = [
            { quote: "Life is like a Kerala monsoon... unexpected but beautiful!", author: "Unknown" },
            { quote: "Success is like making perfect appam... needs patience and practice!", author: "Chef" },
            { quote: "Be like chaya... warm, comforting, and always there when needed!", author: "Tea Lover" },
            { quote: "Dreams are like Kerala's backwaters... deep, calm, and full of possibilities!", author: "Traveler" },
            { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
            { quote: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
            { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
            { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
            { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
            { quote: "Life is 10% what happens to you and 90% how you react to it.", author: "Charles R. Swindoll" }
        ];
        
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `💭 *INSPIRATIONAL QUOTE*\n\n"${randomQuote.quote}"\n\n- ${randomQuote.author}\n\n${config.botName}`
        }, { quoted: msg });
    }
};