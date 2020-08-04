// Require the Bolt package (github.com/slackapi/bolt)

const { App } = require("@slack/bolt");

const axios = require("axios").default;

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
  
  // Delete all goals at midnight
  
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(1, 6)];
  rule.hour = 0;
  rule.minute = 1;

  var j = schedule.scheduleJob(rule, function() {
    axios
      .post(
        process.env.MONGO_DELETE_ENDPOINT,
        {}
      )
      .then(function(response) {
        console.log("Cleared daily goals for the day.");
      })
      .catch(function(error) {
        console.log(error);
      });
  });
  
  // Ping about daily goals
  
  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = [0, new schedule.Range(1, 6)];
  rule.hour = 10;
  rule.minute = 0;

  var j = schedule.scheduleJob(rule, function() {
    publishMessage(process.env.CHANNEL_NAME, "Have you added your daily goals for today? If not, use /addgoal to do it!")
  });

  // publishMessage(process.env.CHANNEL_NAME, "Hello world :tada:");
})();

app.event("app_home_opened", async ({ event, context }) => {
  try {
    const response = await axios.post(
      process.env.MONGO_LIST_ENDPOINT
    );

    var dailyGoals = response.data.text;

    /* view.publish is the method that your app uses to push a view to the Home tab */
    const result = await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view payload that appears in the app home*/
      view: {
        type: "home",
        callback_id: "home_view",

        /* body of the view */
        blocks: [
          {
            type: "divider"
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "Welcome to the daily goals app! \n \n You can use the following commands: \n \n /addgoal [text]: adds a goal. Please include the @ of the person assigned to the goal (for instance, @joao.cachada). \n \n /clearAll: deletes all current daily goals. \n \n /currentgoals: shows all active daily goals. \n \n" + dailyGoals
            }
          },
          {
            type: "actions",
            elements: [
              {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "Delete all daily goals :octagonal_sign: ",
                  emoji: true
                },
                value: "clear_daily_goals"
              }
            ]
          }
        ]
      }
    });
  } catch (error) {
    console.error(error);
  }
});

// Listen for dialog submission, or legacy action
app.action({}, async ({ action, ack }) => {
  await ack();

  var payload = JSON.stringify(action);

  console.log(payload);

  if (payload.includes("clear_daily_goals")) {
    axios
      .post(
        process.env.MONGO_DELETE_ENDPOINT,
        {}
      )
      .then(function(response) {
        console.log("Cleared daily goals for the day.");
      })
      .catch(function(error) {
        console.log(error);
      });
  }
});
