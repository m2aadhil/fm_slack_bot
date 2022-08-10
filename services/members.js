const fs = require("fs");

const writeTeam= (team) => {
  let data = JSON.stringify(team);
  fs.writeFileSync("./assets/members.json", data);
};

const getFinanceTeam = () => {
  let rawdata = fs.readFileSync("./assets/members.json");
  let team = JSON.parse(rawdata);
  return team;
};

const getNextMonitoringPerson = () => {
  const financeTeam = getFinanceTeam();
  const person = financeTeam[0];
  financeTeam.splice(0, 1);
  financeTeam.push(person);
  writeTeam(financeTeam);
  return person;
};

const addMember = (userId, userName) => {
  const financeTeam = getFinanceTeam();
  financeTeam.push({
    index: financeTeam.length,
    userId: userId,
    userName: userName,
  });
  writeTeam(financeTeam);
};

const deleteMember = (userId) => {};

const getFullSchedule = () => {
  const financeTeam = getFinanceTeam();
  let currentMonday = getMondayOfCurrentWeek();
  let payLoad = [];
  for (let i = 0; i < financeTeam.length; i++) {
    payLoad.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text: financeTeam[i].userName + " - " + currentMonday.toDateString(),
      },
    });
    currentMonday.setDate(currentMonday.getDate() + 7);
  }
  return payLoad;
};

function getMondayOfCurrentWeek() {
  const today = new Date();
  const first = today.getDate() - today.getDay() + 1;
  const monday = new Date(today.setDate(first));
  return monday;
}

exports.getNextMonitoringPerson = getNextMonitoringPerson;
exports.getFullSchedule = getFullSchedule;
