import puppeteer from "puppeteer";
import { UserProps } from "./types";
import { LIST_TYPES, MAIN_URL } from "./config/constants";
import {
  moviesDataArray,
  moviesMetadataArray,
  postersArray,
} from "./datafiltering";

/**
 * @description Returns an array of objects with the user's watchlist data
 * @param {Object} params
 * @returns Promise<AxiosResponse<UserModel>>
 */

const getUserMovies = async (user: UserProps) => {
  const { username, typeOfList } = user;

  const moviesArray = [];

  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();

    await page.goto(`${MAIN_URL}/${username}/${LIST_TYPES[typeOfList]}`);

    let lastPageReached = false;

    while (!lastPageReached) {
      const nextPageLink = await page.$(".next");

      await page.waitForSelector(".film-poster > div > a");

      const metadata = await moviesMetadataArray(page);
      const posters = await postersArray(page);
      const moviesCurrentPageArray = await moviesDataArray({
        postersArray: posters,
        moviesMetadataArray: metadata,
      });

      moviesArray.push(...moviesCurrentPageArray);

      const lastOne = await page.evaluate(() => {
        return !!document.querySelector(
          ".paginate-nextprev.paginate-disabled > span.next"
        ); // !! converts anything to boolean
      });

      if (lastOne) {
        lastPageReached = true;
        break;
      }

      // click the next page link
      await nextPageLink?.click();

      // wait for navigation to complete
      await page.waitForNavigation();

      // track the current URL
      const URL = page.url();
    }
    await browser.close();
    return moviesArray;
  } catch (error) {
    console.error(error);
    throw 500;
  }
};

getUserMovies({ username: "maribelbhf", typeOfList: "watchlist" });