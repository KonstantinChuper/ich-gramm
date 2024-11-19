import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Providers } from "@/theme/provider";
import ThemeWrapper from "@/theme/theme-wraper";
import { UnreadMessagesProvider } from "@/contexts/UnreadMessageContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SocketProvider } from "@/contexts/SocketContext";

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
          <SocketProvider>
            <NotificationProvider>
              <UnreadMessagesProvider>
                <ThemeWrapper>
                  <ClientLayout>{children}</ClientLayout>
                </ThemeWrapper>
              </UnreadMessagesProvider>
            </NotificationProvider>
          </SocketProvider>
        </Providers>
      </body>
    </html>
  );
}
