const { createServer } = require("http");
const controller = require("./api/controller");
const cron = require('node-cron');
const job = require('./services/jobs');

const port = process.env.PORT || 3000;

const scheduledTime = '0 10 * * 1';

cron.schedule(scheduledTime, function() {
  job.runMonitoringReminder();
});

(async () => {
  const server = createServer(controller.app);

  server.listen(port, () => {
    console.log(`Starting the server on ${server.address().port}`);
  });
})();
