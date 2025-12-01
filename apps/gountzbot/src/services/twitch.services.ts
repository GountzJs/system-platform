import { twitchApiUrl, twitchClientId, twitchToken } from '../core/settings';

export class TwitchServices {
  private readonly baseUrl = twitchApiUrl;

  async getByUsername(username: string): Promise<string> {
    const headers = {
      Authorization: `Bearer ${twitchToken}`,
      'Client-ID': twitchClientId,
    };
    const res = await fetch(`${this.baseUrl}/helix/users?login=${username}`, {
      headers,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = (await res.json()) as any;

    if (!res.ok) throw new Error('User not found');

    return data.data[0].id;
  }
}
