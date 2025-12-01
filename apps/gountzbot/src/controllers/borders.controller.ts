import { twitchBotUsername } from '../core/settings';
import { TmiClient } from '../lib/twitch-client';
import { AccountQueries } from '../queries/account';
import { AccountBorderQueries } from '../queries/account-border';
import { TwitchServices } from '../services/twitch.services';

export class BordersController {
  constructor(
    private client: TmiClient,
    private accountQueries: AccountQueries = new AccountQueries(),
    private accountBorderQueries: AccountBorderQueries = new AccountBorderQueries(),
    private twitchServices: TwitchServices = new TwitchServices()
  ) {}

  async insertRandom(username: string) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(username);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );
      const borderId = await this.accountBorderQueries.getRandom(accountId);

      await this.accountBorderQueries.insertOrIncrement(accountId, borderId);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification border-1-false-${username}`
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
        `!message error-No se pudo canjear el borde`
      );
    }
  }

  async insertSpecial(username: string, borderId: string) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(username);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );

      await this.accountBorderQueries.assignSpecial(accountId, borderId);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification border-0-true-${username}`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se pudo canjear el borde especial';
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-@${username}: ${errorMessage}`
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
        const borderId = await this.accountBorderQueries.getRandom(accountId);

        await this.accountBorderQueries.insertOrIncrement(accountId, borderId);
      }
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification border-${quantity}-false-${username}`
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
        `!message error-No se pudo canjear el borde`
      );
    }
  }
}
