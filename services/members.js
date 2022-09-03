const database = require("./database")

const getFinanceTeam = async() => {
  let rawdata = await database.findMany("team", {});
  return rawdata;
};

const getNextMonitoringPerson = async () => {
  const financeTeam = await getFinanceTeam();
  const activeMember = financeTeam.find(i => i.active);
  let nextInOrder = activeMember.order + 1;
  if(nextInOrder > financeTeam.length){
    nextInOrder = 1;
  }
  const nextMember = financeTeam.find(i => i.order == nextInOrder);

  await database.updateOne("team", {userId: activeMember.userId}, {$set: {active: false}});
  await database.updateOne("team", {userId: nextMember.userId}, {$set: {active: true}});

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

  await database.updateOne("team", {userId: fromId}, {$set: {order: toMember.order}});
  await database.updateOne("team", {userId: toId}, {$set: {order: fromMember.order}});
};

const getFullSchedule = async () => {
  let financeTeam = await getFinanceTeam();
  const activeOrder = financeTeam.find(i => i.active).order;
  financeTeam.sort((a, b) => { 
    const place = activeOrder - a.order - b.order; 
    if(place < a.order){
      return 1;
    }else if(place > a.order){
      return -1;
    }else{
      return 0;
    }
  })
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
