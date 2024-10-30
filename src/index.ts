import "module-alias/register";
import getList from "./lists/lists";

async function testFunction() {
  const userwatchlist = await getList.watchlist({
    username: "maribelbhf",
    options: {
      posters: true,
    },
  });

  const publicList = await getList.listByTitle({
    username: "maribelbhf",
    listTitle: "Peliculitas para asustarnos de manera uteana v1.0",
    options: {
      posters: false,
    },
  });

  console.log(publicList.data.length);
}

testFunction();
