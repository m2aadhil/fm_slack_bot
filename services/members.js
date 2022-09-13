const database = require("./database")

const getFinanceTeam = async() => {
  let rawdata = await database.findMany("team", {});
  return rawdata;
};

const getNextMonitoringPerson = async () => {
  const financeTeam = await getFinanceTeam();
  const activeMember = financeTeam.find(i => i.active == true);
  let nextInOrder = activeMember.order + 1;
  if(nextInOrder > financeTeam.length){
    nextInOrder = 1;
  }
  const nextMember = financeTeam.find(i => i.order == nextInOrder);

  await database.updateOne("team", {userId: activeMember.userId}, {$set: {active: false}});
  await database.updateOne("team", {userId: nextMember.userId}, {$set: {active: true}});

  return nextMember;
};

const getCurrentMonitoringPerson = async () => {
  const financeTeam = await getFinanceTeam();
  const activeMember = financeTeam.find(i => i.active == true);
  return activeMember;
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

  await database.updateOne("team", {userId: fromId}, {$set: {order: toMember.order, active: toMember.active}});
  await database.updateOne("team", {userId: toId}, {$set: {order: fromMember.order, active:fromMember.active}});
};

const getFullSchedule = async () => {
  let financeTeam = await getFinanceTeam();
  financeTeam = financeTeam.sort((a, b) => {if(b.order-a.order < 0)return 1; if(b.order - a.order > 0){return -1}  return 0;});
  const activeOrder = financeTeam.find(i => i.active).order;
  const array1 =  financeTeam.slice(0, activeOrder-1);
  const array2 = financeTeam.slice(activeOrder-1);

  const teamMembers = array2.concat(array1);

  let currentMonday = getMondayOfCurrentWeek();
  let payLoad = [];
  for (let i = 0; i < teamMembers.length; i++) {
    payLoad.push({
      type: "section",
      text: {
        type: "mrkdwn",
        text:
          "*" +
          currentMonday.toLocaleDateString() +
          "* : " +
          teamMembers[i].userId + " - " +teamMembers[i].userName,
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
exports.getCurrentMonitoringPerson = getCurrentMonitoringPerson;
