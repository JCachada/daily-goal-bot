/* eslint-disable max-len */

const {App} = require('@slack/bolt');

require('dotenv').config();

const jobs = require('./jobs');

const listeners = require('./listeners');

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: 'my-state-secret',
  scopes: ['chat:write.public', 'commands', 'chat:write'],
  installerOptions: {
    authVersion: 'v2',
    metadata: 'some session data',
    installPath: '/slack/installApp',
    redirectUriPath: '/slack/redirect',
    callbackOptions: {
      success: (installation, installOptions, req, res) => {
        res.send('successful!');
      },
      failure: (error, installOptions, req, res) => {
        res.send('failure');
      },
    },
  },
});

(async () => {
  await app.start(process.env.PORT || 3000);

  jobs.setupJobs();

  listeners.setupListeners();

  console.log('⚡️ App is running!');
})();

module.exports.app = app;
