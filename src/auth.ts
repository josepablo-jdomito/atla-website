import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import PostgresAdapter from '@auth/pg-adapter'
import { getPool } from '@/lib/db/postgres'
import bcrypt from 'bcryptjs'

const providers = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const email = (credentials.email as string).toLowerCase().trim()
      const password = credentials.password as string

      const pool = getPool()
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
      const user = result.rows[0]

      if (!user || !user.password) return null

      const valid = await bcrypt.compare(password, user.password)
      if (!valid) return null

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image ?? null,
      }
    },
  }),
]

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }) as any,
  )
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PostgresAdapter(getPool()),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers,
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.image = user.image ?? null
        token.name = user.name ?? null
      }
      if (trigger === 'update' && session) {
        if (session.image !== undefined) token.image = session.image
        if (session.name !== undefined) token.name = session.name
      }
      return token
    },
    session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      if (token?.image !== undefined) {
        session.user.image = (token.image as string) ?? null
      }
      if (token?.name !== undefined) {
        session.user.name = (token.name as string) ?? null
      }
      return session
    },
  },
})
