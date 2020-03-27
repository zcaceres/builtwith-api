#!/usr/bin/env node
require('dotenv').config()

const BuiltWith = require('./src/index')

const url = 'lisasaysgah.com'
const tech = 'Shopify'
const company = 'lisa says gah'

const builtwith = BuiltWith(process.env.BW_API_KEY)

async function freeTest() {
  const bwData = await builtwith.free(url);
  console.log(JSON.stringify(bwData));
}

async function domainTest() {
  const bwData = await builtwith.domain(url, {
    // noAttributeData: true
  });
  console.log(JSON.stringify(bwData))
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

freeTest()
// listsTest()
// trendsTest()
// relationshipsTest()
// keywordsTest()
// companyToURLTest()
// domainLiveTest()
