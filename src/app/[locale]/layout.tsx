import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster"
import "./globals.css";
import ContextProvider from "@/context/ContextProvider";
import { NextAuthProvider } from "@/features/Auth/NextAuthProvider";
import { ReactNode } from "react";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plus = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

export const metadata: Metadata = {
  title: "Altug AI",
  description: "This is Altug AI",
  manifest: "/manifest.json"
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF"
}

interface Props {
  children: ReactNode;
  params: { locale: string };
}


export default async function RootLayout(props: Props) {

  const { children, params: { locale } } = props;

  const messages = await getMessages();
  return (
    <html lang={locale}>

      <body className={`${inter.variable} ${plus.variable} font-plus`}>
        <NextAuthProvider>  <NextIntlClientProvider messages={messages}>
          <ContextProvider>
            {children}
            <Toaster />
          </ContextProvider>
        </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html >
  );
}
