import { signJwtToken } from "../../../../lib/jwt";
import Credentials from "next-auth/providers/credentials";
import { connect } from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";


export const authOptions = {
    providers: [
        Credentials({
            type: "credentials",
            credentials: "",
            async authorize(credentials) {
                await connect();
                const { email, password } = credentials;
                try {
                    const user = await User.findOne({ email });
                    if (!user) {
                        throw new Error("Invalid input");
                    }

                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if (!passwordMatch) {
                        throw new Error("Passwords do not match")
                    } else {
                        const { password, ...currentUser } = user._doc;
                        const accessToken = signJwtToken(currentUser); // Pass currentUser as payload

                        return {
                            ...currentUser,
                            accessToken
                        }
                    }

                } catch (error) {
                    console.error("Authentication error:", error);
                    throw new Error("Invalid credentials");
                }
            }
        }),
    ],
    pages: {
        signIn: "/login"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token._id = user._id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.accessToken = token.accessToken;
            }
            return session;
        }
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
