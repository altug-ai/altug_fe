import NextAuth from 'next-auth';

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface SessData {
    jwt?: string | null;
    user?: {
      id?: number | null;
      username?: string | null;
      email?: string | null;
      error?: string | null;
    };
  }

  interface User {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    id?: string | null;
    randomKey?: string | null;
    data: SessData;
  }
  interface Sess {
    expires: string;
    user?: User;
  }

  interface Session {
    user: User;
  }
}
