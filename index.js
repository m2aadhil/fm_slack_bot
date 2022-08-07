const { createServer } = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const { createEventAdapter } = require("@slack/events-api");
const port = process.env.PORT || 3000;
const slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
const { WebClient } = require("@slack/web-api");
// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);
const cron = require("node-cron");
const financeTeam = require("./members");

// Create an express application
const app = express();
app.use("/my/path", slackEvents.requestListener());

app.get('/', (req, res) => {
  res.send('app works..!');
});

app.post('/hello', (req, res) => {
  console.log("hello")
  web.chat.postMessage({
    channel: "#finance-test-bot",
    link_names: 1,
    text: `Hello! This is notify that I have been setup correctly`,
  });
  res.end("hello");
});

// Example: If you're using a body parser, always put it after the event adapter in the middleware stack
app.use(bodyParser());

const postMessage = async () => {
  const user = financeTeam.getNextMonitoringPerson();
  try {
    await web.chat.postMessage({
      channel: "#finance-test-bot",
      link_names: 1,
      text: `Hello @${user.userId}! It seems you are the monitoring person for this week. Good Luck! :))`,
    });
    console.log("Message posted!");
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  // Start the built-in server
  // Initialize a server for the express app - you can skip this and the rest if you prefer to use app.listen()
  const server = createServer(app);
  server.listen(port, () => {
    // Log a message when the server is ready
    console.log(`Listening for events on ${server.address().port}`);
  });

  //0 8 * * MON
  cron.schedule("0 8 * * MON", () => {
    postMessage();
    console.log("running a task every minute");
  });
})();
