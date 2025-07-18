import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await dbConnect();

        const user = await User.findOne({ email: credentials.email }).select("+password");
        if (!user) throw new Error("No user found");

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        return {
          id: user._id,
          email: user.email,
          name: user.fullName,
          image: user.profilePicture,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      await dbConnect();

      if (user) {
        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = await User.create({
            fullName: user.name || "No Name",
            email: user.email,
            profilePicture: user.image,
            username: user.email.split("@")[0],
            instituteName: "Not Provided",
            isVerified: true,
          });

          token.user = {
            id: newUser._id,
            email: newUser.email,
            name: newUser.fullName,
            image: newUser.profilePicture,
          };
        } else {
          token.user = {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.fullName,
            image: existingUser.profilePicture,
          };
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
