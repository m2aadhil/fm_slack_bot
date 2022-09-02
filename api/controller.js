const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const webChat = require("../services/webChat");
const financeTeam = require("../services/members");

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

app.post('/getschedule', (req, res) => {
  // const schedule = financeTeam.getFullSchedule();
  // console.log(schedule);
  res.json({"blocks": "test"});
});

app.post('/addmember', (req, res) => {
  const userBlocks = req.body.text.split(/ (.*)/s);
  if(userBlocks.length < 1){
    res.end("user id and name must be specifed");
  }
  financeTeam.addMember(userBlocks[0], userBlocks[1]);
  res.end("user added successfully");
});

app.post('/deletemember', (req, res) => {
  const userBlocks = req.body.text.split(/ (.*)/s);
  financeTeam.deleteMember(userBlocks[0]);
  res.end("command executed...");
});

app.post('/swapmember', (req, res) => {
  const userBlocks = req.body.text.split(/:(.*)/s);
  financeTeam.swapMember(userBlocks[0], userBlocks[1]);
  res.end("command executed...");
});


exports.app = app;