import { v4 as uuid } from 'uuid';
import { turso } from '../db/client';

export class AccountStickerQueries {
  async insertOrIncrement(accountId: string, stickerId: string) {
    const { rows } = await turso.execute({
      sql: `
        SELECT quantity
        FROM account_stickers
        WHERE account_id = ? AND sticker_id = ?
        LIMIT 1;
      `,
      args: [accountId, stickerId],
    });

    if (!rows.length) {
      await turso.execute({
        sql: `
          INSERT INTO account_stickers (id, account_id, sticker_id, quantity, created_at, updated_at)
          VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
        args: [uuid(), accountId, stickerId],
      });

      return { quantity: 1, accountId, stickerId };
    }

    await turso.execute({
      sql: `
        UPDATE account_stickers
        SET quantity = quantity + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = ? AND sticker_id = ?;
      `,
      args: [accountId, stickerId],
    });

    return {
      quantity: Number(rows[0].quantity) + 1,
      accountId,
      stickerId,
    };
  }

  async getRandom(accountId: string): Promise<string> {
    const { rows } = await turso.execute({
      sql: `
        SELECT b.id AS sticker_id
        FROM stickers b
        LEFT JOIN account_stickers ab
          ON ab.sticker_id = b.id AND ab.account_id = ?
        ORDER BY RANDOM()
        LIMIT 1;
      `,
      args: [accountId],
    });

    return rows[0].sticker_id as string;
  }
}
