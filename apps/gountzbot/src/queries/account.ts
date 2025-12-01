import { v4 as uuidv4 } from 'uuid';
import { turso } from '../db/client';

export class AccountQueries {
  async getOrCreateAccount(ref: string): Promise<string> {
    const id = uuidv4();
    const { rows: platforms } = await turso.execute({
      sql: `
        SELECT id FROM platforms WHERE name = ?
      `,
      args: ['TWITCH'],
    });
    const platformId = platforms[0].id;
    const { rows } = await turso.execute({
      sql: `
        INSERT INTO accounts (id, ref, is_staff, quantity, platform_id, created_at, updated_at)
        VALUES (?, ?, false, 0, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        ON CONFLICT(ref) DO NOTHING
        RETURNING id;
      `,
      args: [id, ref, platformId],
    });

    if (rows.length > 0) {
      return rows[0].id as string;
    }

    const { rows: existing } = await turso.execute({
      sql: `SELECT id FROM accounts WHERE ref = ?`,
      args: [ref],
    });

    return existing[0].id as string;
  }
}
