Daily Goals Bot
=================

While I was working in an agile environment, my team realized we often forgot to write out what our goals for the day were in the team's Slack channel. Sometimes, we even forgot to define what our goal for the day would be!

I decided to take the opportunity to learn the basics of working with Slack's API and build a simple bot.

Features
------------

* Every day, at midnight, a recurring job cleans all daily goals.
* Every day, at 11 am, a recurring job sends a message to our team channel (defined in an environment variable) reminding us to add the day's daily goals.
* Three slash commands are supported: /addgoal, /currentgoals, and /clearall.
* The added daily goals are persisted in a MongoDB instance with webhooks. You can get a free instance for a homebrew bot [here](https://www.mongodb.com/realm). 
* The app also has a home view that lists all current goals and allows you to clear all the current goals.

Built with
------------

[Bolt](https://slack.dev/bolt) is Slack's framework that lets you build JavaScript-based Slack apps in a flash.


Running the app
------------

- Clone the repository.
- Run `npm install` in the repository folder to install dependencies.
- Configure your `.env` file. 
- Run `npm start`

Configuration files
------------

`.env` contains all the environment variables that shouldn't be part of version control. You need to fill all the variables in that file for the app to work. For how to get your slack tokens, check the [Slack Getting Started Guide](https://api.slack.com/start/building/bolt).

You can find an example `.env` file in `.env.example`. 

`eslintrc.json` contains all the style configurations. I used ESLint to keep a uniform style.

`shrinkwrap.yaml` defines the versions for the dependencies the app uses, to make sure that no unexpected conflicts appear.

`.commitlintrc.json` extends the rules from [Conventional Commits](https://www.conventionalcommits.org/) to make sure that every commit follows a defined standard.

Structure
------------

- `app.js` contains the primary Bolt app. It imports the Bolt package (`@slack/bolt`) and starts the Bolt app's server. It's where I added my app's listeners.
- `listeners.js` is where I added my app's listeners. These listen for events like a user opening the app's dashboard on Slack and react appropriately. 
- `jobs.js` is where my recurring jobs are configured. They're set up every time the app starts.
- `helpers.js` is where I have functions that are useful across the app. For instance, it's where the function to publish a message in a Slack channel lives.
- `.env.example` is where I put an example file for Slack app's authorization token and signing secret. The real .env file is not part of the code in the repository.
- The `examples/` folder contains a couple of other sample apps that you can peruse to your liking. They show off a few platform features that your app may want to use.

Read the [Getting Started guide](https://api.slack.com/start/building/bolt)
-------------------

Read the [Bolt documentation](https://slack.dev/bolt)
-------------------

\ ゜o゜)ノ

Built by João Cachada
