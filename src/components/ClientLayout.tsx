"use client";

import { usePathname } from "next/navigation";
import { PostProvider } from "@/contexts/PostContext";
import AsideMenu from "@/components/AsideMenu";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noAsideRoutes = ["/login", "/register", "/reset"];
  const shouldShowAside = !noAsideRoutes.includes(pathname);

  return (
    <div className="flex min-h-screen">
      {shouldShowAside && <AsideMenu />}
      <div className="flex-1 flex flex-col">
        <main className="flex-1">
          <PostProvider>{children}</PostProvider>
        </main>
        {shouldShowAside && <Footer />}
      </div>
    </div>
  );
}
