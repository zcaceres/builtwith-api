#!/usr/bin/env node
require('dotenv').config()

const BuiltWith = require('./src/index')

const url = 'facebook.com'

const builtwith = BuiltWith(process.env.BW_API_KEY, { responseFormat: 'json' })

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



domainTest()
