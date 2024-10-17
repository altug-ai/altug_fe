import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';
import { fetcher } from './functions';
import { createWallet } from '@/wallet/createWallet';


export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/sign-in',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const responseData = await fetcher(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/local?populate[0]=client_profile`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: credentials.email,
              password: credentials.password,
            }),
          }
        );

        if (responseData?.error) {
          const message = responseData?.error?.message
            ? responseData?.error?.message.replace(
                'Invalid identifier or password',
                'Invalid credentials'
              )
            : 'Something went wrong please retry.';

          return null;
        }

        return {
          id: responseData.user.id,
          data: responseData,
          email: responseData.user.email,
          name: responseData.user.username,
          randomKey: 'Hey cool',
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      if (token?.error) {
        return {
          ...session,
          error: token?.error,
        };
      } else {
        return {
          ...session,
          user: {
            ...session.user,
            data: token.data,
            id: token.id,
            randomKey: token.randomKey,
          },
        };
      }
    },
    // async redirect({ url, baseUrl }) {
    //   // Allows relative callback URLs
    //   if (url.startsWith('/')) return `${baseUrl}${url}`;
    //   // Allows callback URLs on the same origin
    //   else if (new URL(url).origin === baseUrl) return url;
    //   return baseUrl;
    // },
    jwt: async ({ token, user, account, trigger, session }) => {
      // ============================================
      if (trigger == 'update') {
        return { ...token, ...session.user };
      }
      if (account?.provider == 'google' && user) {
        if (user) {
          try {
            const data = await fetcher(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/${account?.provider}/callback?access_token=${account?.access_token}`
            );

            if (!data?.error) {
              const res = await fetcher(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/users/${data?.user.id}?populate=*`,
                {
                  method: 'GET',
                  headers: {
                    Authorization: `Bearer ${data.jwt}`,
                  },
                }
              );

              if (res && !res.client_profile) {
                const { privateKey, smartAccountAddress, success } =
                  await createWallet();

                  console.log
                let dat = {
                  user: res.id,
                  username: data?.user?.email.split('@')[0],
                  privateKey,
                  smartAccountAddress,
                  isWalletDeployed: success,
                };
                console.log("here", dat);
                const profile = await axios.post(
                  `${process.env.NEXT_PUBLIC_STRAPI_URL}/client-profiles`,
                  {
                    data: {
                      user: res.id,
                      username: data?.user?.email.split('@')[0],
                      privateKey,
                      smartAccountAddress,
                      isWalletDeployed: success,
                    },
                  },
                  {
                    method: 'GET',
                    headers: {
                      Authorization: `Bearer ${data.jwt}`,
                    },
                  }
                );

                console.log('the profile', profile);
              }
              token.jwt = data.jwt;

              token = {
                data: {
                  ...token,
                  ...res,
                },
                email: token?.email,
                name: token?.name,
                id: res?.id,
              };
            } else {
              return {
                error: data?.error?.message,
              };
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
      // ============================================
      if (user && account?.provider == 'credentials') {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          data: u.data,
          randomKey: u.randomKey,
        };
      }
      return Promise.resolve(token);
    },
    // signIn: async ({ account,  }) => {
    //   const data = await fetcher(
    //     `${process.env.NEXT_PUBLIC_STRAPI_URL}/auth/${account?.provider}/callback?access_token=${account?.access_token}`
    //   );

    //   if (data?.error) {
    //     return data?.error?.message;
    //   } else {
    //     return true;
    //   }
    // },
  },
};
