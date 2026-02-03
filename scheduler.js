const cron = require("node-cron");
const runFetcher = require("./fetchEvents");

cron.schedule("0 */6 * * *", async () => {
  await runFetcher();
});
