const fs = require("fs");

const getConfig = () => {
  let rawdata = fs.readFileSync("./assets/config.json");
  let config = JSON.parse(rawdata);
  return config;
};

const writeConfig = (config) => {
  let data = JSON.stringify(config);
  fs.writeFileSync("./assets/config.json", data);
};

const getFinanceTeam = () => {
  let rawdata = fs.readFileSync("./assets/members.json");
  let team = JSON.parse(rawdata);
  return team;
};

const getNextMonitoringPerson = () => {
  const financeTeam = getFinanceTeam();
  let config = getConfig();
  if (config.currentIndex >= financeTeam.length) {
    config.currentIndex = 0;
  }
  const person = financeTeam[config.currentIndex++];
  writeConfig(config);
  return person;
};

const addMember = (userId, userName) => {
  const financeTeam = getFinanceTeam();
  financeTeam.push({
    index: financeTeam.length,
    userId: userId,
    userName: userName,
  });
};

const deleteMember = (userId) => {
  const financeTeam = getFinanceTeam();
  const index = financeTeam.findIndex();
  financeTeam.slice(index, 1);
};

const getFullSchedule = () => {
  
}

exports.getNextMonitoringPerson = getNextMonitoringPerson;
