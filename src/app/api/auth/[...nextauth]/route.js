import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/userModel";
import dbConnect from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
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
        if (user.authProvider !== "credentials") {
          throw new Error("Please sign in using Google");
        }

        const isMatch = await bcrypt.compare(credentials.password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        if (!user.isVerified) {
          const isExpired = user.verifyTokenExpiry < Date.now();

          if (isExpired) {
            const newCode = Math.floor(100000 + Math.random() * 900000).toString(); 
            user.verifyToken = newCode;
            user.verifyTokenExpiry = Date.now() + 1000 * 60 * 10; 
            await user.save();
            await sendVerificationEmail(user.email, newCode);
          }

          throw new Error("Email not verified. We've sent a new verification code.");
        }

        return {
          id: user._id,
          email: user.email,
          name: user.username,
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
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const baseUsername = user.email.split("@")[0];
          let username = baseUsername;
          let suffix = 1;

          while (await User.exists({ username })) {
            username = `${baseUsername}${suffix++}`;
          }

          const newUser = await User.create({
            fullName: user.name || "No Name",
            email: user.email,
            profilePicture: user.image,
            username,
            authProvider: "google",
            instituteName: "Not Provided",
            isVerified: true,
          });

          token.user = {
            id: newUser._id,
            email: newUser.email,
            name: newUser.username,
            image: newUser.profilePicture,
          };
        } else {
          token.user = {
            id: existingUser._id,
            email: existingUser.email,
            name: existingUser.username,
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