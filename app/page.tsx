import { LoginButton, LogoutButton } from 'components/buttonts';
import { Chat } from 'components/chat';

import { getSpotifyClient } from 'lib/spotify';

export default async function Home() {
  const spotify = await getSpotifyClient();

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {spotify?.token ? <LogoutButton /> : <LoginButton />}

        <h1>Server Session</h1>
        <Chat />
      </div>
    </main>
  );
}
