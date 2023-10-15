import withAuth from 'next-auth/middleware';

export const TOKEN = process.env.VERCEL
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

export default withAuth({
  callbacks: {
    authorized: ({ req }) => {
      return !!req.cookies.get(TOKEN);
    },
  },
});

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
