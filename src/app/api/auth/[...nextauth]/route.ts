import { authOptions } from '@/lib/auth';
import NextAuth from 'next-auth';
export const maxDuration = 60;
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
