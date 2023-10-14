import { PrismaAdapter } from '@auth/prisma-adapter';
import SpotifyProvider from 'next-auth/providers/spotify';

import prisma from 'lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  ],
};
