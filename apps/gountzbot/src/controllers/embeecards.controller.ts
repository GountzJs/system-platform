import { twitchBotUsername } from '../core/settings';
import { TmiClient } from '../lib/twitch-client';
import { SizePack } from '../models/enums/szie-pack.enum';
import { AccountQueries } from '../queries/account';
import { AccountEmbeeCardQueries } from '../queries/account-embeecard';
import { TwitchServices } from '../services/twitch.services';

export class EmbeeCardsController {
  constructor(
    private client: TmiClient,
    private twitchServices: TwitchServices = new TwitchServices(),
    private accountQueries: AccountQueries = new AccountQueries(),
    private accountEmbeeCardQueries: AccountEmbeeCardQueries = new AccountEmbeeCardQueries()
  ) {}

  async insertSpecial(displayName: string, cardId: string) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(displayName);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );

      await this.accountEmbeeCardQueries.assignSpecial(accountId, cardId);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification card-0-true-${displayName}`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se pudo canjear la carta especial';
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-${errorMessage}`
      );
    }
  }

  async insertRandom(displayName: string) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(displayName);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );
      const cardId = await this.accountEmbeeCardQueries.getRandom(accountId);
      await this.accountEmbeeCardQueries.insertOrIncrement(accountId, cardId);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification card-${SizePack.Individual}-false-${displayName}`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se pudo canjear la carta aleatoria';
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-${errorMessage}`
      );
    }
  }

  async insertManyRandom(displayName: string, quantity: number) {
    try {
      const twitchUser = await this.twitchServices.getByUsername(displayName);
      const accountId = await this.accountQueries.getOrCreateAccount(
        twitchUser
      );
      for (let i = 0; i < quantity; i++) {
        const cardId = await this.accountEmbeeCardQueries.getRandom(accountId);

        await this.accountEmbeeCardQueries.insertOrIncrement(accountId, cardId);
      }
      const pack = this.getPack(quantity);
      this.client.say(
        `#${twitchBotUsername}`,
        `!notification card-${pack}-false-${displayName}`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'No se pudo canjear la carta aleatoria';
      this.client.say(
        `#${twitchBotUsername}`,
        `!message error-${errorMessage}`
      );
    }
  }

  private getPack(quantity: number) {
    if (quantity === 3) return SizePack.SmallPack;
    if (quantity === 6) return SizePack.MediumPack;
    return SizePack.BigPack;
  }
}
