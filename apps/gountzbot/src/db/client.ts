import { createClient } from '@libsql/client';
import { tursoToken, tursoUrl } from '../core/settings';

const config = {
  url: tursoUrl,
  authToken: tursoToken,
};

export const turso = createClient(config);
