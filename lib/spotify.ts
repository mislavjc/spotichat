import { getServerSession } from 'next-auth';

import { ArtistItem, TrackItem } from 'types/spotify';

import { authOptions } from './auth';

interface TopOptions {
  limit?: number;
  offset?: number;
  time_range?: 'short_term' | 'medium_term' | 'long_term';
}

class SpotifyClient {
  token: string | undefined | null;
  private endpoint: string = 'https://api.spotify.com/v1';

  constructor(token: string) {
    this.token = token;
  }

  getTopTracks = async ({
    limit = 20,
    offset = 0,
    time_range = 'medium_term',
  }: TopOptions) => {
    try {
      const response = await fetch(
        `${this.endpoint}/me/top/tracks?limit=${limit}&offset=${offset}&time_range=${time_range}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top tracks');
      }

      const data = await response.json();

      return data.items.map(extractEssentialTrackData);
    } catch (error) {
      throw new Error('Failed to fetch top tracks');
    }
  };

  getTopArtists = async ({
    limit = 20,
    offset = 0,
    time_range = 'medium_term',
  }: TopOptions) => {
    try {
      const response = await fetch(
        `${this.endpoint}/me/top/artists?limit=${limit}&offset=${offset}&time_range=${time_range}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch top artists');
      }

      const data = await response.json();

      return data.items.map(extractEssentialArtistData);
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

const extractEssentialArtistData = (artist: ArtistItem) => {
  return {
    followers: artist.followers.total,
    genres: artist.genres,
    link: artist.external_urls.spotify,
    images: artist.images,
    name: artist.name,
    popularity: artist.popularity,
    type: artist.type,
  };
};

const extractEssentialTrackData = (track: TrackItem) => {
  return {
    artists: track.artists.map((artist) => ({
      link: artist.external_urls.spotify,
      name: artist.name,
      type: artist.type,
    })),
    duration: track.duration_ms,
    url: track.external_urls.spotify,
    popularity: track.popularity,
    type: track.type,
    name: track.name,
    album: {
      link: track.album.external_urls.spotify,
      name: track.album.name,
      type: track.album.type,
    },
  };
};
