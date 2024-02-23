import type { NextAuthConfig } from "next-auth";
import { EmailConfig } from "next-auth/providers/email";
import { Resend } from "resend";
import { EmailTemplate } from "@/components/email-template";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import db from "@/database/drizzle-client";
import GitHub from "next-auth/providers/github";
import google from "next-auth/providers/google";

const resend = new Resend(process.env.RESEND);

export default {
  pages: {
    signIn: "/login",
  },
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub,
    google,
    {
      id: "email",
      name: "Email",
      type: "email",
      sendVerificationRequest: ({ identifier: email, url }) => {
        resend.emails
          .send({
            from: `ThinkAi  <${process.env.EMAIL_FROM}>`,
            to: [email],
            subject: "Sign in to your account | ThinkAI",
            react: EmailTemplate({ url }) as React.ReactElement,
          })
          .then((res) => {
            console.log("RESEND res", res);
          })
          .catch((err) => {
            console.error("RESEND err", err);
          });
      },
    } as EmailConfig,
  ],
  callbacks: {
    jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        token.id = user?.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: { strategy: "jwt" },
} satisfies NextAuthConfig;
