// Require the Bolt package (github.com/slackapi/bolt)

const { App } = require("@slack/bolt");

var schedule = require("node-schedule");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: id,
      text: text
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");

  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(1, 6)];
  rule.hour = 20;
  rule.minute = 44;

  var j = schedule.scheduleJob(rule, function() {
    console.log("Today is recognized by Rebecca Black!");
  });

  publishMessage(process.env.CHANNEL_NAME, "Hello world :tada:");
})();
