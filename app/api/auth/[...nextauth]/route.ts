import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

/**
 * NEXTAUTH_URL is not set in the Amplify build environment, so NextAuth fell
 * back to http://localhost:3000 — the same failure as the Apple callback,
 * where `request.url` inside Lambda is the internal address. This is a public
 * URL, so defaulting it here is safe; the env var still wins when present.
 *
 * NOTE: this does NOT fix /api/auth/session returning 500. That is NextAuth's
 * NO_SECRET error — NEXTAUTH_SECRET signs session JWTs and must come from the
 * Amplify environment, never from the repository. GOOGLE_CLIENT_SECRET is the
 * same. Until both are set, Google sign-in stays unavailable; every other
 * provider builds its own authorize URL and is unaffected.
 */
process.env.NEXTAUTH_URL ??= 'https://app.trendupp.com';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    // Attach Google's idToken so we can forward it to your backend
    async jwt({ token, account }) {
      if (account?.id_token) {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken as string;
      return session;
    },
  },
  // Keep this false — you're managing sessions yourself via Zustand + your JWT
  session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
