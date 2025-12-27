module.exports = {
    name: 'joke',
    alias: ['funny', 'ജോക്ക്'],
    desc: 'Get random jokes',
    category: 'fun',
    execute: async (sock, msg, args, { config }) => {
        const jokes = [
            "എന്താ കുറച്ച് നേരം പറഞ്ഞത്?\nകാരണം എനിക്ക് സമയം കിട്ടി! 😂",
            "Why did the WhatsApp bot go to therapy?\nIt had too many attachment issues! 📎",
            "What do you call a Malayali who doesn't drink chaya? ☕\nSoftware update in progress! 👨‍💻",
            "എന്താണ് കണ്ണുനീരിനെ പറ്റി പറയുന്നത്?\nകാരണം അത് വെള്ളമാണ്, പക്ഷേ ഉപ്പില്ല! 😭😂",
            "Why was the computer cold? ❄️\nIt left its Windows open! 🪟",
            "What do you call a fake noodle? 🍜\nAn Impasta! 🤌",
            "Why don't scientists trust atoms? ⚛️\nBecause they make up everything! 🤯",
            "എന്തുകൊണ്ട് കോഴിക്ക് റോഡ് കടക്കാൻ പറ്റി?\nകാരണം അതിന് തീരുമാനം എടുക്കാൻ സമയം കിട്ടി! 🐔",
            "Why did the scarecrow win an award? 🏆\nBecause he was outstanding in his field! 🌾",
            "What do you call a sleeping bull? 🐂\nA bulldozer! 😴"
        ];
        
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `😂 *RANDOM JOKE*\n\n${randomJoke}\n\n${config.botName}`
        }, { quoted: msg });
    }
};