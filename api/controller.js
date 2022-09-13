const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const webChat = require("../services/webChat");
const financeTeam = require("../services/members");
const jobs = require("../services/jobs");

app.use(bodyParser());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//routes
app.get('/', (req, res) => {
  res.send('app works..!');
});

app.post('/hello', (req, res) => {
  webChat.postMessage(`Hello! This is to notify that I have been setup correctly`);
  res.end("hello");
});

app.post('/getschedule', async (req, res) => {
  const schedule = await financeTeam.getFullSchedule();
  res.json({"blocks": schedule});
});

app.post('/addmember', async (req, res) => {
  const userBlocks = req.body.text.split(/ (.*)/s);
  if(userBlocks.length < 1){
    res.end("user id and name must be specifed");
  }
  await financeTeam.addMember(userBlocks[0], userBlocks[1]);
  res.end("user added successfully");
});

app.post('/deletemember', async (req, res) => {
  const userBlocks = req.body.text.split(/ (.*)/s);
  await financeTeam.deleteMember(userBlocks[0]);
  res.end("command executed...");
});

app.post('/swapmember', async (req, res) => {
  const userBlocks = req.body.text.split(/:(.*)/s);
  await financeTeam.swapMember(userBlocks[0], userBlocks[1]);
  res.end("command executed...");
});

app.get('/runjob', async (req, res) => {
  await jobs.runMonitoringReminder();
  res.end("command executed...");
});

app.post('/notify', async (req, res) => {
  let person = await financeTeam.getCurrentMonitoringPerson();
  const message = `Hello @${person.userId}! It seems you are the monitoring person for this week. Good Luck! :))`;
  webChat.postMessage(message);
});


exports.app = app;