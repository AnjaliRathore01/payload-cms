#!/usr/bin/env tsx

import { config as dotenvConfig } from 'dotenv'

// Load environment variables
dotenvConfig()

console.log('Environment Variables Check:')
console.log(
  `PAYLOAD_SECRET: ${process.env.PAYLOAD_SECRET ? '✅ SET (' + process.env.PAYLOAD_SECRET.substring(0, 10) + '...)' : '❌ MISSING'}`,
)
console.log(
  `DATABASE_URI: ${process.env.DATABASE_URI ? '✅ SET (' + process.env.DATABASE_URI.substring(0, 20) + '...)' : '❌ MISSING'}`,
)

if (!process.env.PAYLOAD_SECRET || !process.env.DATABASE_URI) {
  console.log('\n❌ Required environment variables are missing.')
  console.log('Please check your .env file.')
  process.exit(1)
}

console.log('\n✅ All required environment variables are present!')
