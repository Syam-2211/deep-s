// config/welcome.js
module.exports = {
    // Enable/disable features
    enabled: true,
    welcomeEnabled: true,
    goodbyeEnabled: true,
    
    // Message settings
    welcomeMessages: [
        "🎉 Welcome @user to *{group}*! 🎉\nType .menu for commands!",
        "👋 Hello @user! Welcome to {group}!\nEnjoy your stay! 😊",
        "🚀 @user joined the party! Welcome to {group}!",
        "🌟 Welcome @user! I'm {botname}, your assistant!",
        "🥳 @user is here! Welcome to {group} family!"
    ],
    
    goodbyeMessages: [
        "👋 Goodbye @user! We'll miss you!",
        "🚪 @user has left {group}. Farewell!",
        "😔 @user left the group. Take care!",
        "🌅 Farewell @user! Hope to see you again!",
        "👋 @user said goodbye. All the best!"
    ],
    
    // Settings
    mentionUser: true,
    showGroupName: true,
    showBotName: true,
    randomizeMessages: true,
    
    // Auto-response settings
    autoReplyToWelcome: false,
    welcomeReply: "Thank you! 😊",
    
    // Image/gif settings (optional)
    welcomeImage: null, // URL to image
    goodbyeImage: null, // URL to image
    
    // Cooldown settings (milliseconds)
    cooldown: 30000, // 30 seconds between welcome messages
    
    // Group-specific settings
    groupSettings: {
        // Example: Disable for specific groups
        // "123456789@g.us": { welcomeEnabled: false }
    }
};