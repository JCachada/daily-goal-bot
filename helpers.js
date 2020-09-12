const app = require('./app');

require('dotenv').config();

/**
 * Publishes a message to the defined slack channel.
 * @param {text} text The message to publish..
 */
async function publishMessage(text) {
  try {
    const result = await app.app.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: process.env.CHANNEL_NAME,
      text: text,
    });
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

module.exports.publishMessage = publishMessage;
