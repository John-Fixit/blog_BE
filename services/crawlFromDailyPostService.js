const { default: axios } = require("axios");
const cheerio = require("cheerio");

// const url = "https://saharareporters.com/";

const url = "https://dailypost.ng/";

 const getBodyOfPost = async (link) => {
  if (!link) return "";
  try {
    const data = await (await fetch(link)).text();

    const $ = cheerio.load(data);


    const post_img_url = $("#mvp-post-content > #mvp-post-feat-img > img").attr("src")

    const post_category = $("header#mvp-post-head > h3.mvp-post-cat.left.relative > a.mvp-post-cat-link > span.mvp-post-cat.left").text()?.trim();

    const post_title = $("header#mvp-post-head > h1.mvp-post-title.left.entry-title").text()?.trim();

    const posted_by = $(".mvp-author-info-name.left.relative > span.author-name.vcard.fn.author > a").text()?.trim();


    const post_created_at = $(".mvp-author-info-date.left.relative > meta")
      .attr("content")
      ?.trim();
    const post_body = $("#mvp-content-body-top > #mvp-content-main").html();
    return { post_created_at, post_body, post_title, post_category, posted_by, post_img_url };
  } catch (err) {
    console.log(err?.message);
  }
};

const crawlData = async () => {
  try {
    const data = await (await fetch(url)).text(); // fetch the website to be scraped

    const $ = cheerio.load(data); //load the data into cheerio

    const listElement = await $(".mvp-widget-feat1-cont.left.relative").find(
      "a"
    );

    const dailyCrawledPost = await Promise.all(
      listElement.map(async (i, element) => {
        const post_link = $(element).attr("href")?.trim();
        const post_img_url = $(element)
          .find(".mvp-widget-feat1-bot-story.left.relative > div > img")
          .attr("src")
          ?.trim();
        const post_title = $(element)
          .find(".mvp-widget-feat1-bot-text.left.relative > h2")
          .text()
          ?.trim();
        const post_category = $(element).find(".mvp-widget-feat1-bot-text.left.relative > .mvp-cat-date-wrap.left.relative > span.mvp-cd-cat.left.relative").text()?.trim()

        if (post_link) {
          const desc = await getBodyOfPost(post_link);
          return {
            post_link,
            post_img_url,
            post_title,
            category: post_category,
            post_created_at: desc?.post_created_at,
            post_body: desc?.post_body,
            posted_by: desc?.posted_by,
          };
        }
      })
    );


    return dailyCrawledPost.filter(item=> item?.post_body && item?.post_created_at && item?.post_img_url && item?.post_link && item?.post_title)

  } catch (err) {
    console.log(err)?.message;
  }
};

module.exports = { crawlData, getBodyOfPost }
