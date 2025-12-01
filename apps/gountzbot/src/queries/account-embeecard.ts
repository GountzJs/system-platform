import { v4 as uuid } from 'uuid';
import { turso } from '../db/client';

export class AccountEmbeeCardQueries {
  async assignSpecial(accountId: string, embeecardId: string) {
    const { rows } = await turso.execute({
      sql: `
        SELECT id
        FROM account_embeecards
        WHERE account_id = ? AND embeecard_id = ?;
      `,
      args: [accountId, embeecardId],
    });

    if (rows.length) {
      throw new Error('Ya tienes la carta especial asignada');
    }

    await turso.execute({
      sql: `
        INSERT INTO account_embeecards (id, account_id, embeecard_id, quantity, created_at, updated_at)
        VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
      `,
      args: [uuid(), accountId, embeecardId],
    });

    return { accountId, embeecardId, quantity: 1 };
  }

  async getRandom(accountId: string): Promise<string> {
    const { rows } = await turso.execute({
      sql: `
      SELECT e.id AS embeecard_id
      FROM embeecards e
      JOIN embeecard_categories ec ON e.category_id = ec.id
      LEFT JOIN account_embeecards ae
        ON ae.embeecard_id = e.id AND ae.account_id = ?
      WHERE ec.name != 'SPECIAL'
        AND (ae.id IS NULL OR ae.quantity < 5)
      ORDER BY RANDOM()
      LIMIT 1;
    `,
      args: [accountId],
    });

    if (!rows.length) {
      throw new Error('No hay cartas disponibles');
    }

    return rows[0].embeecard_id as string;
  }

  async insertOrIncrement(accountId: string, embeecardId: string) {
    const { rows } = await turso.execute({
      sql: `
        SELECT quantity
        FROM account_embeecards
        WHERE account_id = ? AND embeecard_id = ?
        LIMIT 1;
      `,
      args: [accountId, embeecardId],
    });

    if (!rows.length) {
      await turso.execute({
        sql: `
          INSERT INTO account_embeecards (id, account_id, embeecard_id, quantity, created_at, updated_at)
          VALUES (?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
        `,
        args: [uuid(), accountId, embeecardId],
      });

      return { quantity: 1, accountId, embeecardId };
    }

    await turso.execute({
      sql: `
        UPDATE account_embeecards
        SET quantity = quantity + 1,
            updated_at = CURRENT_TIMESTAMP
        WHERE account_id = ? AND embeecard_id = ?;
      `,
      args: [accountId, embeecardId],
    });

    return {
      quantity: Number(rows[0].quantity) + 1,
      accountId,
      embeecardId,
    };
  }
}
