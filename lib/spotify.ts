import { getServerSession } from 'next-auth';

import { TopArtistsResponse, TopTracksResponse } from 'types/spotify';

import { authOptions } from './auth';

class SpotifyClient {
  token: string | undefined | null;
  private endpoint: string = 'https://api.spotify.com/v1';

  constructor(token: string) {
    this.token = token;
  }

  getTopTracks = async (limit = 30): Promise<TopTracksResponse> => {
    try {
      const response = await fetch(
        `${this.endpoint}/me/top/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch top tracks');
    }
  };

  getTopArtists = async (limit = 30): Promise<TopArtistsResponse> => {
    try {
      const response = await fetch(
        `${this.endpoint}/me/top/artists?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top artists');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Failed to fetch top artists');
    }
  };
}

export const getSpotifyClient = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.token) {
    return null;
  }

  return new SpotifyClient(session.token);
};
