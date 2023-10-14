import { getServerSession } from 'next-auth';

import { LoginButton, LogoutButton } from 'components/buttonts';

import { authOptions } from 'lib/auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {session?.user ? <LogoutButton /> : <LoginButton />}

        <h1>Server Session</h1>
        <pre>{JSON.stringify(session)}</pre>
      </div>
    </main>
  );
}
