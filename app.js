// Require the Bolt package (github.com/slackapi/bolt)

import {App} from '@slack/bolt';

import axios from 'axios';

import {RecurrenceRule, Range, scheduleJob} from 'node-schedule';

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

/**
 * Adds two numbers together.
 * @param {text} channelId The name of the channel to publish a message in.
 * @param {text} text The message to publish..
 */
async function publishMessage(channelId, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: process.env.SLACK_BOT_TOKEN,
      channel: channelId,
      text: text,
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

  console.log('⚡️ Bolt app is running!');

  // Delete all goals at midnight

  const deleteRule = new RecurrenceRule();
  deleteRule.dayOfWeek = [0, new Range(1, 6)];
  deleteRule.hour = 0;
  deleteRule.minute = 1;

  scheduleJob(deleteRule, function() {
    axios
        .post(
            process.env.MONGO_DELETE_ENDPOINT,
            {},
        )
        .then(function(response) {
          console.log('Cleared daily goals for the day.');
        })
        .catch(function(error) {
          console.log(error);
        });
  });

  // Ping about daily goals

  const pingRule = new RecurrenceRule();
  pingRule.dayOfWeek = [0, new Range(1, 6)];
  pingRule.hour = 10;
  pingRule.minute = 0;

  scheduleJob(deleteRule, function() {
    publishMessage(
        process.env.CHANNEL_NAME,
        'Have you added your daily goals for today? ' +
        'If not, use /addgoal to do it!');
  });

  // publishMessage(process.env.CHANNEL_NAME, "Hello world :tada:");
})();

app.event('app_home_opened', async ({event, context}) => {
  try {
    const response = await axios.post(
        process.env.MONGO_LIST_ENDPOINT,
    );

    const dailyGoals = response.data.text;

    await app.client.views.publish({
      /* retrieves your xoxb token from context */
      token: context.botToken,

      /* the user that opened your app's app home */
      user_id: event.user,

      /* the view payload that appears in the app home*/
      view: {
        type: 'home',
        callback_id: 'home_view',

        /* body of the view */
        blocks: [
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to the daily goals app! \n \n You can use the following commands: \n \n /addgoal [text]: adds a goal. Please include the @ of the person assigned to the goal (for instance, @joao.cachada). \n \n /clearAll: deletes all current daily goals. \n \n /currentgoals: shows all active daily goals. \n \n' + dailyGoals,
            },
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Delete all daily goals :octagonal_sign: ',
                  emoji: true,
                },
                value: 'clear_daily_goals',
              },
            ],
          },
        ],
      },
    });
  } catch (error) {
    console.error(error);
  }
});

// Listen for dialog submission, or legacy action
app.action({}, async ({action, ack}) => {
  await ack();

  const payload = JSON.stringify(action);

  console.log(payload);

  if (payload.includes('clear_daily_goals')) {
    axios
        .post(
            process.env.MONGO_DELETE_ENDPOINT,
            {},
        )
        .then(function(response) {
          console.log('Cleared daily goals for the day.');
        })
        .catch(function(error) {
          console.log(error);
        });
  }
});
