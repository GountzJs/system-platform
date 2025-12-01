import { Client, Events } from 'tmi.js';
import {
  debug,
  twitchBotUsername,
  twitchChannel,
  twitchToken,
} from '../core/settings';
import { sanitizeMessage } from '../utils/utils';

export class TmiClient {
  private client?: Client;
  private _isConnected: boolean;

  constructor() {
    this._isConnected = false;
    this.#initClient();
  }

  #initClient() {
    const options = {
      connection: { reconnect: true },
      channels: [twitchChannel, `#${twitchBotUsername}`],
      debugger: debug,
      identity: {
        username: twitchBotUsername,
        password: `oauth:${twitchToken}`,
      },
    };
    this.client = new Client(options);
  }

  async connect(): Promise<void> {
    await this.client?.connect();
    this._isConnected = true;
  }

  disconnect() {
    if (!this._isConnected) return;
    return this.client?.disconnect().then(() => (this._isConnected = false));
  }

  on<K extends keyof Events>(
    key: K,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (...args: any[]) => void
  ): Client | undefined {
    return this.client?.on(key, callback);
  }

  say(channel: string, message: string): Promise<[string]> | undefined {
    return this.client?.say(channel, sanitizeMessage(message));
  }

  get isConnected() {
    return this._isConnected;
  }
}
