const { WebClient } = require("@slack/web-api");
const web = new WebClient(process.env.SLACK_TOKEN);
const channel = "#finance-test-bot";

const postMessage = async (message) => {
  try {
    await web.chat.postMessage({
      channel: channel,
      link_names: 1,
      text: message,
    });
  } catch (error) {
    console.error(error);
  }
};

exports.postMessage = postMessage;
