module.exports = {
    name: 'weather',
    alias: ['wthr', 'കാലാവസ്ഥ'],
    desc: 'Get weather information',
    category: 'search',
    execute: async (sock, msg, args, { config }) => {
        const location = args.join(' ') || 'Kerala';
        
        if (!location) {
            await sock.sendMessage(msg.key.remoteJid, {
                text: `❌ Please specify a location!\nUsage: ${config.prefix}weather [city]`
            }, { quoted: msg });
            return;
        }
        
        // Mock weather data (replace with actual API)
        const weatherData = {
            temperature: Math.floor(Math.random() * 35) + 20,
            condition: ['Sunny', 'Rainy', 'Cloudy', 'Stormy'][Math.floor(Math.random() * 4)],
            humidity: Math.floor(Math.random() * 50) + 50,
            wind: Math.floor(Math.random() * 20) + 5
        };
        
        const emoji = {
            'Sunny': '☀️',
            'Rainy': '🌧️',
            'Cloudy': '☁️',
            'Stormy': '⛈️'
        };
        
        await sock.sendMessage(msg.key.remoteJid, {
            text: `${emoji[weatherData.condition]} *WEATHER FORECAST*\n\n` +
                  `📍 Location: ${location}\n` +
                  `🌡️ Temperature: ${weatherData.condition} ${weatherData.temperature}°C\n` +
                  `💧 Humidity: ${weatherData.humidity}%\n` +
                  `💨 Wind: ${weatherData.wind} km/h\n\n` +
                  `📢 Advice: ${weatherData.condition === 'Rainy' ? 'Carry umbrella! ☔' : 'Have a nice day! 😊'}\n\n` +
                  `${config.botName}`
        }, { quoted: msg });
    }
};