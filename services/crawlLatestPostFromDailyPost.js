const cheerio = require("cheerio");
const { getBodyOfPost } = require("./crawlFromDailyPostService");

const crawlLatestPost = async () => {
  const url = "https://dailypost.ng/";

  try {
    const html = await (await fetch(url)).text();

    const $ = cheerio.load(html);

    const listElement = await $(".mvp-main-box > ul").find("li > a");

    const latestPosts = await Promise.all(
      listElement.map(async (i, element) => {
        const link = $(element).attr("href")?.trim();

        if (link) {
          const post_detail = await getBodyOfPost(link);

          return {
            post_created_at: post_detail?.post_created_at,
            post_body: post_detail?.post_body,
            post_title: post_detail?.post_title,
            category: post_detail?.post_category,
            posted_by: post_detail?.posted_by,
            post_img_url: post_detail?.post_img_url,
          };
        }
      })
    );


    return latestPosts?.filter(item=> item?.post_body && item?.post_created_at && item?.post_img_url && item?.post_link && item?.post_title);
  } catch (error) {
    console.log(error);
  }
};


module.exports = { crawlLatestPost };
