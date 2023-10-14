import NextAuth, {
  Account as NextAuthAccount,
  DefaultSession,
} from 'next-auth';
import { JWT as NextAuthJWT } from 'next-auth/jwt';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    token?: string | undefined | null;
    id: string | undefined | null;
    name: string | undefined | null;
    avatar: string | undefined | null;
    account: string | undefined | null;
    token: string | undefined | null;
  }
}
