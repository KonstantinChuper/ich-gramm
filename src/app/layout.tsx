import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Providers } from "@/theme/provider";
import ThemeWrapper from "@/theme/theme-wraper";
import ThemeToggle from "@/components/ThemeToggle";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessageContext";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "ICHgramm",
  description: "ICHgramm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} antialiased`} suppressHydrationWarning>
        <Providers>
          <UnreadMessagesProvider>
            <ThemeWrapper>
              <ThemeToggle />
              <ClientLayout>{children}</ClientLayout>
            </ThemeWrapper>
          </UnreadMessagesProvider>
        </Providers>
      </body>
    </html>
  );
}
