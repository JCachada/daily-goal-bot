/* eslint-disable max-len */
const app = require('./app');

const axios = require('axios').default;

/**
 * Sets up the app's listeners.
 */
function setupListeners() {
  setupAppHomeOpenedListener();
  setupClearGoalsButtonListener();
}

/**
 * Sets up the behavior when the app home is opened.
 */
function setupAppHomeOpenedListener() {
  app.app.event('app_home_opened', async ({event, context}) => {
    try {
      const response = await axios.post(process.env.MONGO_LIST_ENDPOINT);

      const dailyGoals = response.data.text;

      await app.app.client.views.publish({
        token: context.botToken,

        user_id: event.user,

        view: {
          type: 'home',
          callback_id: 'home_view',

          blocks: [
            {
              type: 'divider',
            },
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text:
                  'Welcome to the daily goals app! \n \n You can use the following commands: \n \n /addgoal [text]: adds a goal.' +
                  ' Please include the @ of the person assigned to the goal (for instance, @joao.cachada). \n ' +
                  '\n /clearAll: deletes all current daily goals. \n \n /currentgoals: shows all active daily goals. \n \n' +
                  dailyGoals,
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
}

/**
 * Sets up the behavior when the "Clear All Goals" button is pressed.
 */
function setupClearGoalsButtonListener() {
  app.app.action({}, async ({action, ack}) => {
    await ack();

    const payload = JSON.stringify(action);

    console.log(payload);

    if (payload.includes('clear_daily_goals')) {
      axios
          .post(process.env.MONGO_DELETE_ENDPOINT, {})
          .then(function(response) {
            console.log('Cleared daily goals for the day.');
          })
          .catch(function(error) {
            console.log(error);
          });
    }
  });
}

module.exports.setupListeners = setupListeners;
