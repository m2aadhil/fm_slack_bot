const { createServer } = require("http");
const jobs = require("./services/jobs")
const controller = require("./controller");

const port = process.env.PORT || 3000;


(async () => {
  const server = createServer(controller.app);
  server.listen(port, () => {
    console.log(`Starting the server on ${server.address().port}`);
  });

  jobs.runMonitoringReminder();
})();
