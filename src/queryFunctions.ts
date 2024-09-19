import puppeteer from "puppeteer";
import { UserQueryProps, MovieObjectProps } from "./types";
import { LIST_TYPES, MAIN_URL } from "./config/constants";
import { listScrapper } from "./datafiltering";

/**
 * @description Returns an array of objects with the user's watchlist data
 * @param {String} username - Letterboxd username
 * @param {String} category - Content category (watchlist, films)
 * @returns {MovieObjectProps}  - An array of Objects with movies data
 */

// Actualmente tengo 223

export const getUserList = async (user: UserQueryProps) => {
  const { username, category, options } = user;
  const { posters = false } = options;
  const listArray = [];

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}`);

    let allDataCollected = false;

    // while(!allDataCollected){

    await page.waitForSelector(".paginate-nextprev");

    const moviesArray = await listScrapper({ page, posters });

    // }
  } catch (error) {
    console.error(error);
    throw 500;
  }
};

// const test = async (user: UserQueryProps) => {
//   const { username, category } = user;

//   const moviesArray = [];

//   try {
//     const browser = await puppeteer.launch();

//     const page = await browser.newPage();

//     await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[category]}`);

//     let lastPageReached = false;

//     while (!lastPageReached) {
//       const nextPageLink = await page.$(".next");

//       await page.waitForSelector(".film-poster > div > a");

//       const metadata = await moviesMetadataArray(page);
//       const posters = await postersArray(page);
//       const moviesCurrentPageArray = await moviesDataArray({
//         postersArray: posters,
//         moviesMetadataArray: metadata,
//       });
//       //   console.log(moviesCurrentPageArray);
//       moviesArray.push(...metadata);

//       const lastOne = await page.evaluate(() => {
//         return !!document.querySelector(
//           ".paginate-nextprev.paginate-disabled > span.next"
//         ); // !! converts anything to boolean
//       });

//       if (lastOne) {
//         lastPageReached = true;
//         break;
//       }

//       // click the next page link
//       await nextPageLink?.click();

//       // wait for navigation to complete
//       await page.waitForNavigation();

//       await page.waitForSelector(".paginate-nextprev");
//       // track the current URL
//       const URL = page.url();
//     }
//     await browser.close();
//     moviesArray.forEach((el) => console.log(el.name));
//     console.log(moviesArray.length);
//     return moviesArray;
//   } catch (error) {
//     console.error(error);
//     throw 500;
//   }
// };