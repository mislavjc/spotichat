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

  getRecommendations = async (options: RecommendationsOptions) => {
    const queryParams = new URLSearchParams();
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    });

    try {
      const response = await fetch(
        `${this.endpoint}/recommendations?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();
      return data.tracks.map(extractEssentialTrackData);
    } catch (error) {
      throw new Error('Failed to fetch recommendations');
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

interface RecommendationsOptions {
  limit?: number;
  market?: string;
  seed_artists?: string;
  seed_genres?: string;
  seed_tracks?: string;
  min_acousticness?: number;
  max_acousticness?: number;
  target_acousticness?: number;
  min_danceability?: number;
  max_danceability?: number;
  target_danceability?: number;
  min_duration_ms?: number;
  max_duration_ms?: number;
  target_duration_ms?: number;
  min_energy?: number;
  max_energy?: number;
  target_energy?: number;
  min_instrumentalness?: number;
  max_instrumentalness?: number;
  target_instrumentalness?: number;
  min_key?: number;
  max_key?: number;
  target_key?: number;
  min_liveness?: number;
  max_liveness?: number;
  target_liveness?: number;
  min_loudness?: number;
  max_loudness?: number;
  target_loudness?: number;
  min_mode?: number;
  max_mode?: number;
  target_mode?: number;
  min_popularity?: number;
  max_popularity?: number;
  target_popularity?: number;
  min_speechiness?: number;
  max_speechiness?: number;
  target_speechiness?: number;
  min_tempo?: number;
  max_tempo?: number;
  target_tempo?: number;
  min_time_signature?: number;
  max_time_signature?: number;
  target_time_signature?: number;
  min_valence?: number;
  max_valence?: number;
  target_valence?: number;
}

type ReccomendationKeys = keyof RecommendationsOptions;

export const reccomendationOptions: Record<
  ReccomendationKeys,
  {
    type: string;
    description: string;
  }
> = {
  limit: {
    type: 'number',
    description:
      'The target size of the list of recommended tracks. For seeds with unusually small pools or when highly restrictive filtering is applied, it may be impossible to generate the requested number of recommended tracks. Debugging information for such cases is available in the response. Default: 20. Minimum: 1. Maximum: 100.',
  },
  market: {
    type: 'string',
    description:
      'An ISO 3166-1 alpha-2 country code. If a country code is specified, only content that is available in that market will be returned.',
  },
  seed_artists: {
    type: 'string',
    description:
      'A comma separated list of Spotify IDs for seed artists. Up to 5 seed values may be provided in any combination of seed_artists, seed_tracks and seed_genres. Note: only required if seed_genres and seed_tracks are not set. Example value: "4NHQUGzhtTLFvgF5SZesLK"',
  },
  seed_genres: {
    type: 'string',
    description:
      'A comma separated list of any genres in the set of available genre seeds. Example value: "classical,country"',
  },
  seed_tracks: {
    type: 'string',
    description:
      'A comma separated list of Spotify IDs for a seed track. Example value: "0c6xIDDpzE81m2q797ordA"',
  },
  min_acousticness: {
    type: 'number',
    description: 'A hard floor on the acousticness value. Range: 0 - 1',
  },
  max_acousticness: {
    type: 'number',
    description: 'A hard ceiling on the acousticness value. Range: 0 - 1',
  },
  target_acousticness: {
    type: 'number',
    description: 'Target value for acousticness. Range: 0 - 1',
  },
  min_danceability: {
    type: 'number',
    description: 'A hard floor on the danceability value. Range: 0 - 1',
  },
  max_danceability: {
    type: 'number',
    description: 'A hard ceiling on the danceability value. Range: 0 - 1',
  },
  target_danceability: {
    type: 'number',
    description: 'Target value for danceability. Range: 0 - 1',
  },
  min_duration_ms: {
    type: 'integer',
    description: 'A hard floor on the track duration in milliseconds.',
  },
  max_duration_ms: {
    type: 'integer',
    description: 'A hard ceiling on the track duration in milliseconds.',
  },
  target_duration_ms: {
    type: 'integer',
    description: 'Target duration of the track in milliseconds.',
  },
  min_energy: {
    type: 'number',
    description: 'A hard floor on the energy value. Range: 0 - 1',
  },
  max_energy: {
    type: 'number',
    description: 'A hard ceiling on the energy value. Range: 0 - 1',
  },
  target_energy: {
    type: 'number',
    description: 'Target value for energy. Range: 0 - 1',
  },
  min_instrumentalness: {
    type: 'number',
    description: 'A hard floor on the instrumentalness value. Range: 0 - 1',
  },
  max_instrumentalness: {
    type: 'number',
    description: 'A hard ceiling on the instrumentalness value. Range: 0 - 1',
  },
  target_instrumentalness: {
    type: 'number',
    description: 'Target value for instrumentalness. Range: 0 - 1',
  },
  min_key: {
    type: 'integer',
    description: 'A hard floor on the key value. Range: 0 - 11',
  },
  max_key: {
    type: 'integer',
    description: 'A hard ceiling on the key value. Range: 0 - 11',
  },
  target_key: {
    type: 'integer',
    description: 'Target value for key. Range: 0 - 11',
  },
  min_liveness: {
    type: 'number',
    description: 'A hard floor on the liveness value. Range: 0 - 1',
  },
  max_liveness: {
    type: 'number',
    description: 'A hard ceiling on the liveness value. Range: 0 - 1',
  },
  target_liveness: {
    type: 'number',
    description: 'Target value for liveness. Range: 0 - 1',
  },
  min_loudness: {
    type: 'number',
    description: 'A hard floor on the loudness value.',
  },
  max_loudness: {
    type: 'number',
    description: 'A hard ceiling on the loudness value.',
  },
  target_loudness: {
    type: 'number',
    description: 'Target value for loudness.',
  },
  min_mode: {
    type: 'integer',
    description: 'A hard floor on the mode value. Range: 0 - 1',
  },
  max_mode: {
    type: 'integer',
    description: 'A hard ceiling on the mode value. Range: 0 - 1',
  },
  target_mode: {
    type: 'integer',
    description: 'Target value for mode. Range: 0 - 1',
  },
  min_popularity: {
    type: 'integer',
    description: 'A hard floor on the popularity value. Range: 0 - 100',
  },
  max_popularity: {
    type: 'integer',
    description: 'A hard ceiling on the popularity value. Range: 0 - 100',
  },
  target_popularity: {
    type: 'integer',
    description: 'Target value for popularity. Range: 0 - 100',
  },
  min_speechiness: {
    type: 'number',
    description: 'A hard floor on the speechiness value. Range: 0 - 1',
  },
  max_speechiness: {
    type: 'number',
    description: 'A hard ceiling on the speechiness value. Range: 0 - 1',
  },
  target_speechiness: {
    type: 'number',
    description: 'Target value for speechiness. Range: 0 - 1',
  },
  min_tempo: {
    type: 'number',
    description: 'A hard floor on the tempo value.',
  },
  max_tempo: {
    type: 'number',
    description: 'A hard ceiling on the tempo value.',
  },
  target_tempo: {
    type: 'number',
    description: 'Target tempo in BPM.',
  },
  min_time_signature: {
    type: 'integer',
    description: 'A hard floor on the time signature value. Maximum value: 11',
  },
  max_time_signature: {
    type: 'integer',
    description: 'A hard ceiling on the time signature value.',
  },
  target_time_signature: {
    type: 'integer',
    description: 'Target value for time signature.',
  },
  min_valence: {
    type: 'number',
    description: 'A hard floor on the valence value. Range: 0 - 1',
  },
  max_valence: {
    type: 'number',
    description: 'A hard ceiling on the valence value. Range: 0 - 1',
  },
  target_valence: {
    type: 'number',
    description: 'Target value for valence. Range: 0 - 1',
  },
};
