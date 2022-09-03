const database = require("./database")

const getFinanceTeam = async() => {
  let rawdata = await database.findMany("team", {});
  return rawdata;
};

const getNextMonitoringPerson = async () => {
  const financeTeam = await getFinanceTeam();
  let activeMember = financeTeam.find(i => i.active);
  let nextInOrder = activeMember.order + 1;
  if(nextInOrder > financeTeam.length){
    nextInOrder = 1;
  }
  let nextMember = financeTeam.find(i => i.order == nextInOrder);
  nextMember.active = true;
  activeMember.active = false;

  await database.updateOne("team", {userId: activeMember.userId}, activeMember);
  await database.updateOne("team", {userId: nextMember.userId}, nextMember);

  return nextMember;
};

const addMember = async (userId, userName) => {
  const financeTeam = await getFinanceTeam();
  await database.insertOne(
    "team",
    {
      userId: userId,
      userName: userName,
      order: financeTeam.length + 1,
      active: false
    }
  );
};

const deleteMember = async (userId) => {
  await database.deleteOne(
    "team",
    { userId: userId }
  );
};

const swapMember = async (fromId, toId) => {
  const financeTeam = await getFinanceTeam();

  let fromMember = financeTeam.find(i => i.userId == fromId);
  let toMember = financeTeam.find(i => i.userId == toId);
  
  const toOrder = toMember.order;
  toMember.order = fromMember.order;
  fromMember.order = toOrder;

  await database.updateOne("team", {userId: fromId}, fromMember);
  await database.updateOne("team", {userId: toId}, toMember);
};

const getFullSchedule = async () => {
  const financeTeam = await getFinanceTeam();
  let currentMonday = getMondayOfCurrentWeek();
  let payLoad = [];
  for (let i = 0; i < financeTeam.length; i++) {
    payLoad.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*" +
          currentMonday.toLocaleDateString() +
          "* : " +
          financeTeam[i].userId + " - " +financeTeam[i].userName,
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
exports.addMember = addMember;
exports.deleteMember = deleteMember;
exports.swapMember = swapMember;
