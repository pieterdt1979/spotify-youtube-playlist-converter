import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import GoogleProvider from "next-auth/providers/google"

const SPOTIFY_SCOPES = [
  "user-read-email",
  "user-read-private",
  "playlist-read-private",
  "playlist-read-collaborative",
].join(" ")

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/youtube",
  "https://www.googleapis.com/auth/youtube.force-ssl",
].join(" ")

export const authOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: SPOTIFY_SCOPES,
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: GOOGLE_SCOPES,
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, account }: { token: any; account: any }) {
      // Store tokens in JWT for stateless authentication
      if (account) {
        token.provider = account.provider
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.accessTokenExpires = account.expires_at
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.accessTokenExpires as number) * 1000) {
        return token
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: { session: any; token: any }) {
      // Send properties to the client
      session.provider = token.provider as string
      session.accessToken = token.accessToken as string
      session.error = token.error as string

      return session
    },
  },
  session: {
    strategy: "jwt" as const,
  },
}

async function refreshAccessToken(token: Record<string, unknown>) {
  try {
    const url = token.provider === "spotify" 
      ? "https://accounts.spotify.com/api/token"
      : "https://oauth2.googleapis.com/token"

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: token.provider === "spotify" 
          ? process.env.SPOTIFY_CLIENT_ID!
          : process.env.GOOGLE_CLIENT_ID!,
        client_secret: token.provider === "spotify"
          ? process.env.SPOTIFY_CLIENT_SECRET!
          : process.env.GOOGLE_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: String(token.refreshToken),
      }),
      method: "POST",
    })

    const refreshedTokens = await response.json()

    if (!response.ok) {
      throw refreshedTokens
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    }
  } catch (error) {
    console.error("Error refreshing access token:", error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

export default NextAuth(authOptions)
