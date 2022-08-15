const cron = require("node-cron");
const financeTeam = require("./members");
const webChat = require("./webChat");

const runMonitoringReminder = () => {
  //0 8 * * MON
  cron.schedule("0 8 * * TUE", () => {
    const nextUser = financeTeam.getNextMonitoringPerson();
    console.log(nextUser);
    const message = `Hello @${nextUser.userId}! It seems you are the monitoring person for this week. Good Luck! :))`;
    webChat.postMessage(message);
  });
};

exports.runMonitoringReminder = runMonitoringReminder;
