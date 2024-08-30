import { Toaster } from "@/components/ui/toaster";
import ContextProvider from "@/context/ContextProvider";
import { NextAuthProvider } from "@/features/Auth/NextAuthProvider";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ReactNode } from "react";
import localFont from 'next/font/local'
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plus = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-plus",
});

const clash = localFont({
  src: [
    {
      path: '../../../public/fonts/ClashGrotesk-Regular.otf',
      weight: '400'
    },
    {
      path: '../../../public/fonts/ClashGrotesk-Medium.otf',
      weight: '500'
    },
    {
      path: '../../../public/fonts/ClashGrotesk-Semibold.otf',
      weight: '600'
    },
    {
      path: '../../../public/fonts/ClashGrotesk-Bold.otf',
      weight: '700'
    }
  ],
  variable: '--font-clash'
})

export const metadata: Metadata = {
  title: "Pro Legacy",
  description: "Pro Legacy",
  manifest: "/manifest.json",
  icons: {
    icon: "favicons/favicon.ico",
    shortcut: "favicons/favicon-32x32.png",
    apple: "favicons/apple-touch-icon.png",
  }
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

      <body className={`${inter.variable} ${plus.variable} ${clash.variable} font-plus`}>
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
