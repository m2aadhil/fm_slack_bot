const cron = require("node-cron");
const financeTeam = require("./members");
const webChat = require("./webChat");

const runMonitoringReminder = () => {
  const nextUser = financeTeam.getNextMonitoringPerson();
  const message = `Hello @${nextUser.userId}! It seems you are the monitoring person for this week. Good Luck! :))`;
  //0 8 * * MON
  cron.schedule("0 8 * * MON", () => {
    webChat.postMessage(message);
  });
};

exports.runMonitoringReminder = runMonitoringReminder;
