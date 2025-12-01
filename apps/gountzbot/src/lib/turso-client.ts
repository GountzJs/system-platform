import { createClient } from '@libsql/client';
import { tursoToken, tursoUrl } from '../core/settings';

if (!tursoUrl || !tursoToken) {
  throw new Error('Missing environment variables');
}

export const turso = createClient({
  url: tursoUrl,
  authToken: tursoToken,
});
