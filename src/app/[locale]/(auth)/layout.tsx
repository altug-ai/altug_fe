import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const session: any = await getServerSession(authOptions);
    if (session?.user?.id) {
        redirect('/profile');
    }

    return (
        <div>
            {children}
        </div>
    );
}
