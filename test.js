#!/usr/bin/env node
require("dotenv").config();

const BuiltWith = require("./src/index");

const url = "builtwith.com";
const multi_test = ["builtwith.com", "google.com"];
const tech = "Shopify";
const company = "BuiltWith";

const builtwith = BuiltWith(process.env.BW_API_KEY);

async function freeTest() {
  const bwData = await builtwith.free(url);
  console.log(JSON.stringify(bwData));
}

async function domainTest() {
  const bwData = await builtwith.domain(url, {
    // noAttributeData: true
  });
  console.log(JSON.stringify(bwData));
}

async function listsTest() {
  const bwData = await builtwith.lists(tech);
  console.log(JSON.stringify(bwData));
}

async function relationshipsTest() {
  const bwData = await builtwith.relationships(url);
  console.log(JSON.stringify(bwData));
}

async function keywordsTest() {
  const bwData = await builtwith.keywords(url);
  console.log(JSON.stringify(bwData));
}

async function multiTest() {
  const bwData = await builtwith.keywords(multi_test);
  console.log(JSON.stringify(bwData));
}

async function trendsTest() {
  const bwData = await builtwith.trends(tech);
  console.log(JSON.stringify(bwData));
}

async function companyToURLTest() {
  const bwData = await builtwith.companyToUrl(company);
  console.log(JSON.stringify(bwData));
}

async function domainLiveTest() {
  const bwData = await builtwith.domainLive(url);
  console.log(JSON.stringify(bwData));
}

async function trustTest() {
  const bwData = await builtwith.trust(url, {
    live: true,
    words: "technology,  data",
  });
  console.log(JSON.stringify(bwData));
}

async function tagsTest() {
  const bwData = await builtwith.tags(url);
  console.log(JSON.stringify(bwData));
}

async function recommendationsTest() {
  const bwData = await builtwith.recommendations(url);
  console.log(JSON.stringify(bwData));
}

async function redirectsTest() {
  const bwData = await builtwith.redirects(url);
  console.log(JSON.stringify(bwData));
}

async function productTest() {
  const bwData = await builtwith.product("shoes");
  console.log(JSON.stringify(bwData));
}

// freeTest();
// domainTest();
// listsTest();
// trendsTest();
// relationshipsTest();
// keywordsTest();
// multiTest();
// companyToURLTest();
// domainLiveTest();
// trustTest();
// tagsTest();
// recommendationsTest();
// redirectsTest();
// productTest();
