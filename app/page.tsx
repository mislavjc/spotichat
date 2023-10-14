import { LoginButton, LogoutButton } from 'components/buttonts';

import { getSpotifyClient } from 'lib/spotify';

export default async function Home() {
  const spotify = await getSpotifyClient();

  const topArtists = await spotify?.getTopArtists(2);

  const topTracks = await spotify?.getTopTracks(2);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {spotify?.token ? <LogoutButton /> : <LoginButton />}

        <h1>Server Session</h1>
        <div>
          <pre>{JSON.stringify(topArtists, null, 2)}</pre>
          <pre>{JSON.stringify(topTracks, null, 2)}</pre>
        </div>
      </div>
    </main>
  );
}
