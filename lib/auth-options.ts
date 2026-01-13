

import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getDatabase } from "./mongo"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    return null
                }

                const db = await getDatabase()
                const user = await db.collection("users").findOne({
                    username: credentials.username,
                })

                if (!user) return null

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password_hash
                )

                if (!isValid) return null

                return {
                    id: user._id.toString(),
                    username: user.username,
                    telegram_id: user.telegram_id ?? null,
                    selfie_path: user.selfie_path ?? null,
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.username = user.username
                token.telegram_id = user.telegram_id
                token.selfie_path = user.selfie_path
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
                session.user.username = token.username as string
                session.user.telegram_id = token.telegram_id as string | null
                session.user.selfie_path = token.selfie_path as string | null
            }
            return session
        },
    },

    pages: {
        signIn: "/auth/login",
        signUp: "/auth/signup",
    },

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,
}
