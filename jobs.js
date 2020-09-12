const schedule = require('node-schedule');

const axios = require('axios').default;

const helpers = require('./helpers');

/**
 * Sets up the recurrent jobs required to run the app.
 */
function setupJobs() {
  setupDailyCleanUp();
  setupDailyReminderPing();
}

/**
 * Sets up a job that deletes leftover goals at midnight every day.
 */
function setupDailyCleanUp() {
  const deleteRule = new schedule.RecurrenceRule();
  deleteRule.dayOfWeek = [0, new schedule.Range(1, 6)];
  deleteRule.hour = 0;
  deleteRule.minute = 1;

  schedule.scheduleJob(deleteRule, function() {
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
}

/**
 * Sets up a job that reminds the team to set their daily goals daily.
 */
function setupDailyReminderPing() {
  const pingRule = new schedule.RecurrenceRule();
  pingRule.dayOfWeek = [0, new schedule.Range(1, 6)];
  pingRule.hour = 10;
  pingRule.minute = 0;

  schedule.scheduleJob(pingRule, function() {
    helpers.publishMessage(
        'Have you added your daily goals for today? ' +
          'If not, use /addgoal to do it!');
  });
}

module.exports.setupJobs = setupJobs;
