import dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env['NODE_ENV'] || 'production';
export const NATS_URL = process.env['NATS_URL'] || 'nats://localhost:4222';
export const TELEGRAM_ACCESS_TOKEN =
  // process.env['TELEGRAM_ACCESS_TOKEN'] || 'abcdefghij';
  process.env['TELEGRAM_ACCESS_TOKEN'] ||
  '5190047021:AAGHNIyf1VF68TAF1JiM0hofW3YmLrGjTnE';
export const TELEGRAM_CHAT_ID =
  // process.env['TELEGRAM_CHAT_ID'] || '-zzzzzZZZZzzzz';
  process.env['TELEGRAM_CHAT_ID'] || '-1001685613498';
