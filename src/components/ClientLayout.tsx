"use client";

import { usePathname } from "next/navigation";
import AsideMenu from "@/components/AsideMenu";
import Footer from "@/components/Footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noAsideRoutes = ["/login", "/register", "/reset"];
  const shouldShowAside = !noAsideRoutes.includes(pathname);

  return (
    <div>
      <div className="flex">{shouldShowAside && <AsideMenu />}</div>
      <div className="flex flex-col justify-between h-screen">
        <main className="flex-1">{children}</main>
        {shouldShowAside && <Footer />}
      </div>
    </div>
  );
}
