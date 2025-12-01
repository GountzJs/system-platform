import { v4 as uuid } from 'uuid';
import { turso } from '../db/client';

export class AccountBorderQueries {
  async insertOrIncrement(accountId: string, borderId: string) {
    const { rows } = await turso.execute({
      sql: `
        SELECT quantity
        FROM account_borders
        WHERE account_id = ? AND border_id = ?
        LIMIT 1;
      `,
      args: [accountId, borderId],
    });

    if (!rows.length) {
      await turso.execute({
        sql: `
          INSERT INTO account_borders (id, account_id, border_id, quantity, created_at, updated_at)
          VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
        args: [uuid(), accountId, borderId],
      });

      return { quantity: 1, accountId, borderId };
    }

    await turso.execute({
      sql: `
        UPDATE account_borders
        SET quantity = quantity + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = ? AND border_id = ?;
      `,
      args: [accountId, borderId],
    });

    return {
      quantity: Number(rows[0].quantity) + 1,
      accountId,
      borderId,
    };
  }

  async getRandom(accountId: string): Promise<string> {
    const { rows } = await turso.execute({
      sql: `
        SELECT b.id AS border_id
        FROM borders b
        LEFT JOIN account_borders ab
          ON ab.border_id = b.id AND ab.account_id = ?
        WHERE b.is_special = false
          AND (ab.id IS NULL OR ab.quantity < 7)
        ORDER BY RANDOM()
        LIMIT 1;
      `,
      args: [accountId],
    });

    if (!rows.length) {
      throw new Error('No hay bordes disponibles');
    }

    return rows[0].border_id as string;
  }

  async assignSpecial(accountId: string, borderId: string) {
    const { rows } = await turso.execute({
      sql: `
        SELECT id
        FROM account_borders
        WHERE account_id = ? AND border_id = ?;
      `,
      args: [accountId, borderId],
    });

    if (rows.length) {
      throw new Error('Ya tienes el borde especial asignado');
    }

    await turso.execute({
      sql: `
        INSERT INTO account_borders (id, account_id, border_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `,
      args: [uuid(), accountId, borderId],
    });

    return { accountId, borderId, quantity: 1 };
  }
}
