import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/libs/prisma";

export const authOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            id: "credentials",
            name: "credentials",
            credentials: {},

            async authorize(credentials, req) {
                const { email, password } = credentials;

                try {
                    const user = await prisma.user.findFirst({
                        where: {
                            email: email,
                        },
                    });

                    if (user) {
                        // check password
                        const passwordMatch = await bcrypt.compare(password, user.password);

                        if (passwordMatch) {
                            // If everything is successful, return the user
                            return user;
                        } else {
                            throw new Error("Invalid password!");
                        }
                    } else {
                        throw new Error("Invalid email address!");
                    }
                } catch (error) {
                    console.error("Error processing the request:", error);
                    throw error;
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, //30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.userRole;
            }
            return token;
        },

        async session({ session, token }) {
            const dbUser = await prisma.user.findUnique({
                where: { id: token.id },
            });

            if (dbUser) {
                session.user = {
                    ...session.user,
                    id: dbUser.id,
                    name: dbUser.name,
                    email: dbUser.email,
                    role: dbUser.userRole,
                    selectedUniversity: dbUser.selectedUniversity || null,
                    subscription: dbUser.subscription || null,
                    avatar: dbUser.avatar || null,
                };
            }

            return session;
        }
    },
};
