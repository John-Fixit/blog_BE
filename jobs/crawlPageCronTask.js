const cron = require("node-cron");
const { crawlPost } = require("../Controllers/post.controller");
const { crawlData } = require("../services/crawlFromDailyPostService");
const { crawlLatestPost } = require("../services/crawlLatestPostFromDailyPost");

cron.schedule("* * * * *", async () => {
  try {
    const data = await crawlData();
    await crawlPost(data);
  } catch (err) {
    console.log(err);
  }
});

cron.schedule("* * * * *", async () => {
  try {
    const data = await crawlLatestPost();

    await crawlPost(data);
  } catch (err) {
    console.log(err);
  }
});
