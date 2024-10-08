const { default: axios } = require("axios");
const cheerio = require("cheerio");
const { BOOLEAN } = require("sequelize");

// const url = "https://saharareporters.com/";

const url = "https://dailypost.ng/";

const getBodyOfPost = async (link) => {
  if (!link) return "";
  try {
    const data = await (await fetch(link)).text();

    const $ = cheerio.load(data);

    const post_created_at = $(".mvp-author-info-date.left.relative > meta")
      .attr("content")
      ?.trim();
    const post_body = $("#mvp-content-body-top > #mvp-content-main").html();
    return { post_created_at, post_body };
  } catch (err) {
    console.log(err);
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
            ...desc,
          };
        }
      })
    );

    console.log(dailyCrawledPost);

    return dailyCrawledPost.filter(item=> item?.post_body && item?.post_created_at && item?.post_img_url && item?.post_link && item?.post_title)

  } catch (err) {
    console.log(err);
  }
};

module.exports = { crawlData }

// const cheerio = require('cheerio');
// const base_url = 'https://saharareporters.com';

// const newDetail = async (link) => {
//     if (!link) return "";
//     try {
//         const html = await (await fetch(link)).text();
//         const $ = cheerio.load(html);
//         const des = $('.column.is-6.group-middle p').text().trim();
//         return des;
//     } catch (error) {
//         return ""
//     }
// }

// const newList = async () => {
//     try {

//         const html = await (await fetch(base_url)).text();
//         const $ = cheerio.load(html);
//         const listElements = $('.columns.is-multiline.is-centered').find('.column.is-flex-column');

//         const phones = await Promise.all(
//             listElements.map(async i => {
//                 const image = $(listElements[i]).find('figure.image > img').attr('src')?.trim();
//                 const post_title = $(listElements[i]).find('.post_title.is-3 > a').text().trim();
//                 const link = $(listElements[i]).find('div:nth-child(1) > div > a').attr("href")?.trim();
//                 if (link) {
//                     const description = await newDetail(`${base_url}${link}`);
//                     return {
//                         post_title,
//                         image: `${base_url}/${image}`,
//                         description
//                     };
//                 }
//             })
//         );

//         return phones.filter(x => x !== undefined)
//     } catch (error) {
//         console.log(error);
//         return [];
//     }
// }

// const scrapeData = async () => {
//     try {
//         const news = await newList();
//         console.log(news);
//     } catch (error) {
//         console.log(error);
//     }

// }

// scrapeData()
