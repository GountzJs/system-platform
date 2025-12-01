import { twitchBotUsername } from '../core/settings';
import { TmiClient } from '../lib/twitch-client';
import { AccountQueries } from '../queries/account';
import { AccountStickerQueries } from '../queries/account-sticker';
import { TwitchServices } from '../services/twitch.services';

export class Worlds2025Controller {
  constructor(
    private readonly client: TmiClient,
    private readonly twitchServices: TwitchServices = new TwitchServices(),
    private readonly accountQueries: AccountQueries = new AccountQueries(),
    private readonly accountStickerQueries: AccountStickerQueries = new AccountStickerQueries()
  ) {}

  async insertRandom(username: string) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(username);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );
      const stickerId = await this.accountStickerQueries.getRandom(accountId);

      await this.accountStickerQueries.insertOrIncrement(accountId, stickerId);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification sticker-1-false-${username}`
      );
    } catch (err) {
      if (err instanceof Error) {
        this.client.say(
          `#${twitchBotUsername}`,
          `!message error-${err.message}`
        );
      }
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-No se pudo canjear el sticker`
      );
    }
  }

  async insertManyRandom(username: string, quantity: number) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(username);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );
      for (let i = 0; i < quantity; i++) {
        const stickerId = await this.accountStickerQueries.getRandom(accountId);

        await this.accountStickerQueries.insertOrIncrement(
          accountId,
          stickerId
        );
      }
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification sticker-${quantity}-false-${username}`
      );
    } catch (err) {
      if (err instanceof Error) {
        this.client.say(
          `#${twitchBotUsername}`,
          `!message error-${err.message}`
        );
      }
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-No se pudo canjear el sticker`
      );
    }
  }
}
