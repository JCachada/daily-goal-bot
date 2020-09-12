/* eslint-disable max-len */

const {App} = require('@slack/bolt');

require('dotenv').config();

const jobs = require('./jobs');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

(async () => {
  await app.start(process.env.PORT || 3000);

  jobs.setupJobs();

  console.log('⚡️ App is running!');
})();

module.exports.app = app;
