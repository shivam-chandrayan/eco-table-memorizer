// import express (after npm install express)
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const path = require("path");

// URL of the page we want to scrape
const url = "https://chessgames.com/chessecohelp.html";

// create new express app and save it as "app"
const app = express();

// server configuration
const PORT = 8080;

// setting template EJS
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Async function which scrapes the data
async function scrapeData() {
  // Fetch HTML of the page we want to scrape
  const { data } = await axios.get(url);
  // Load HTML we fetched in the previous line
  const $ = cheerio.load(data);
  var codes = {};
  const codeList = $("tr");
  // Use .each method to loop through the li we selected
  codeList.each((idx, el) => {
    const code = $(el).children("td:first");
    const info = code.next().text();
    const temp = info.split("\n");
    const name = temp[0];
    const move = temp[1];

    const obj = {};
    obj.name = name;
    obj.move = move;

    codes[code.text()] = obj;
  });
  return codes;
}

// create a route for the app
app.get("/", async (req, res) => {
  const codes = await scrapeData();
  res.render("index", {
    codes: codes,
  });
});

app.get("/:reqCode", async (req, res) => {
  var reqCode = req.params.reqCode;
  const codes = await scrapeData();

  res.render("code", {
    codes: codes[reqCode],
  });
});

// make the server listen to requests
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}/`);
});
