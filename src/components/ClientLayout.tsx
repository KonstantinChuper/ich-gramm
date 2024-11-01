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
      <div className="flex w-full">
        {shouldShowAside && <AsideMenu />}
        <main className="flex-1">{children}</main>
      </div>
      {shouldShowAside && <Footer />}
    </div>
  );
}
