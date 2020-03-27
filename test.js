#!/usr/bin/env node
require("dotenv").config()

const BuiltWith = require('./src/index')

const url = 'facebook.com'

const builtwith = BuiltWith(process.env.BW_API_KEY)

async function test() {
  const bwData = await builtwith.free(url)
  console.dir(bwData)
}

test()
