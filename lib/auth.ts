import { PrismaAdapter } from '@auth/prisma-adapter';
import { NextAuthOptions, Session } from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';

import prisma from 'lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session: existingSession, user }) {
      return await getSession(existingSession, user);
    },
  },
};

const fetchAccessToken = async (
  refreshToken: string | null | undefined,
  account: string,
) => {
  const request = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`,
      ).toString('base64')}`,
    },
    body: `grant_type=refresh_token&refresh_token=${refreshToken}`,
  });

  if (request.ok) {
    const response = await request.json();
    const { access_token, expires_in, refresh_token } = response;
    const timestamp = Math.floor((Date.now() + expires_in * 1000) / 1000);

    await prisma.account.update({
      where: {
        provider_providerAccountId: {
          provider: 'spotify',
          providerAccountId: account,
        },
      },
      data: {
        access_token,
        expires_at: timestamp,
        refresh_token,
      },
    });

    return access_token;
  } else {
    console.error(
      `Failed to refresh token: ${request.status} ${request.statusText}`,
    );
    return null;
  }
};

const getSession = async (existingSession: Session, user: any) => {
  if (!existingSession || !user) {
    return existingSession;
  }

  try {
    const response = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      include: {
        accounts: true,
      },
    });

    const session = {
      id: response?.id,
      name: response?.name,
      avatar: response?.image,
      account: response?.accounts[0].providerAccountId,
      token: response?.accounts[0].access_token,
      expires: response?.accounts[0].expires_at?.toString()!,
    };

    const expiresAt = response?.accounts[0].expires_at ?? Date.now();

    const now = Math.floor(Date.now() / 1000);
    const difference = Math.floor((expiresAt - now) / 60);
    const refreshToken = response?.accounts[0].refresh_token;

    if (difference <= 10) {
      const accessToken = await fetchAccessToken(
        refreshToken,
        session.account as string,
      );
      if (accessToken) {
        session.token = accessToken;
      }
    }

    return session;
  } catch (error) {
    console.error(`Failed to fetch session: ${error}`);
    return existingSession;
  }
};
