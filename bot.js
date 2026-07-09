require('dotenv').config();
const { App } = require('@slack/bolt');

// Initialize Bolt App using credentials from .env
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// 1. Log Messages using the Slack Events API
app.message(async ({ message, say }) => {
  // Simple check to skip bot's own messages
  if (!message.subtype || message.subtype !== 'bot_message') {
    console.log(`[LOG] New Message in channel ${message.channel}: "${message.text}" from User: ${message.user}`);
    
    // Optional: Auto-respond to any message containing "help"
    if (message.text.toLowerCase().includes('help')) {
      await say(`Hey <@${message.user}>! Need some help? Try using the slash command \`/hello\`.`);
    }
  }
});

// 2. Recognize Commands like /hello
app.command('/hello', async ({ command, ack, respond }) => {
  // Acknowledge the command request immediately
  await ack();
  
  console.log(`[LOG] Command /hello triggered by user ${command.user_id}`);
  await respond(`Hello <@${command.user_id}>! Welcome to the channel! 👋`);
});

// Start the App
(async () => {
  const port = 3000;
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Bolt app is running on port ${port}!`);
})();