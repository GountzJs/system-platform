import axios from 'axios';
import { twitchApiUrl, twitchClientId, twitchToken } from '../core/settings';

export class TwitchServices {
  private readonly baseUrl = twitchApiUrl;

  async getByUsername(username: string): Promise<string> {
    const headers = {
      Authorization: `Bearer ${twitchToken}`,
      'Client-ID': twitchClientId,
    };

    const res = await axios({
      method: 'get',
      url: `${this.baseUrl}/helix/users?login=${username}`,
      headers,
    });

    const { data } = res.data;

    if (!data.length) throw new Error('User not found');

    return data[0];
  }
}
