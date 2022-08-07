const { WebClient } = require("@slack/web-api");
const { createEventAdapter } = require("@slack/events-api");

// Create a new instance of the WebClient class with the token read from your environment variable
const web = new WebClient(process.env.SLACK_TOKEN);
const slackEvents = createEventAdapter(process.env.SLACK_TOKEN);
// The current date
const currentTime = new Date().toTimeString();

var cron = require("node-cron");
const financeTeam = require("./members");

// Read the port from the environment variables, fallback to 3000 default.
const port = process.env.PORT || 3000;

const postMessage = async() => {
    const user = financeTeam.getNextMonitoringPerson();
    try{
        await web.chat.postMessage({
            channel: "#finance-test-bot",
            link_names: 1,
            text: `Hello @${user.userId}! You are the monitoring person for this week. Good Luck!`,
          });
          console.log("Message posted!");
    } catch (error) {
    console.log(error);
  }

}

(async () => {
  // Start the built-in server
  const server = await slackEvents.start(port);

    cron.schedule("* * * * *", () => {
        postMessage();
        console.log("running a task every minute");
    });

  // Log a message when the server is ready
  console.log(`Listening for events on ${server.address().port}`);
})();
