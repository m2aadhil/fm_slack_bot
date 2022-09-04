const { createServer } = require("http");
const controller = require("./api/controller");

const port = process.env.PORT || 3000;


(async () => {
  const server = createServer(controller.app);
  server.listen(port, () => {
    console.log(`Starting the server on ${server.address().port}`);
  });
})();
