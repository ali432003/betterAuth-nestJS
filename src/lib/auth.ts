import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { bearer, openAPI } from "better-auth/plugins";
import { envConfig } from "./config";
export const auth = betterAuth({
    baseURL: envConfig.BETTER_AUTH_URL,
    secret: envConfig.BETTER_AUTH_SECRET,
    trustedOrigins: ["http://localhost:5173"],
    user:{
      additionalFields:{
        role: {
          type: "string",
        },
      },
    },
    database: prismaAdapter(prisma, {
        provider: "postgresql",
      }),
    emailAndPassword:{
        enabled: true,
    },
    socialProviders:{
      google:{
        prompt: "select_account consent",
        clientId: envConfig.GOOGLE_CLIENT_ID as string,
        clientSecret: envConfig.GOOGLE_CLIENT_SECRET as string,
      },
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7,
      updateAge: 60 * 60 * 24, 
      cookieCache: {
        enabled: false,
      },
    },
    advanced: {
      useSecureCookies: true,
      cookies: {
        session_token: {
          attributes: {
            sameSite: "none",
            httpOnly: true,
            secure: true,
          },
        },
      },
    },
    plugins: [ 
      openAPI(),
      bearer() 
  ] 
});