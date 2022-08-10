const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const webChat = require("./services/webChat");
const financeTeam = require("./services/members");

//routes
app.get('/', (req, res) => {
  res.send('app works..!');
});

app.post('/hello', (req, res) => {
  webChat.postMessage(`Hello! This is to notify that I have been setup correctly`);
  res.end("hello");
});

app.post('/getschedule', (req, res) => {
  const schedule = financeTeam.getFullSchedule();
  res.end(schedule);
});

app.use(bodyParser());

exports.app = app;