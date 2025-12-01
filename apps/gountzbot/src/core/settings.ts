import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

const envPath = resolve(cwd(), '.env');

if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

const env = process.env;

export const debug = env.DEBUG === 'true';

export const {
  NODE_ENV: nodeEnv = 'development',
  TURSO_URL: tursoUrl = '',
  TURSO_TOKEN: tursoToken = '',
  TWITCH_CLIENT_ID: twitchClientId = '',
  TWITCH_TOKEN: twitchToken = '',
  TWITCH_USERNAME: twitchBotUsername = '',
  TWITCH_CHANNEL: twitchChannel = '',
  TWITCH_API_URL: twitchApiUrl = '',
} = env;
