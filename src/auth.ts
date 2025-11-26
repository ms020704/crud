import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'
import connectMongoDB from './libs/mongodb'
import User from './models/user'
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!, // .env 5줄
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // .env 6줄
    }),
    GitHub({
      clientId: process.env.GITHUB_ID!, // .env 8줄
      clientSecret: process.env.GITHUB_SECRET!, // .env 9줄
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      const apiUrl = process.env.API_URL
      const { name, email } = user
      if (account?.provider === 'google' || account?.provider === 'github') {
        try {
          await connectMongoDB()
          const userExists = await User.findOne({ email })
          if (!userExists) {
            const res = await fetch(`${apiUrl}/api/user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, email }),
            })
            if (res.ok) {
              return true
            }
          }
          const res1 = await fetch(`${apiUrl}/api/log`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
          })
          if (res1.ok) {
            return true
          }
        } catch (error) {
          console.log(error)
          return false
        }
      }
      return true
    },
  },
})
