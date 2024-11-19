import Link from "next/link";
import { menuItems } from "@/components/icons/menu/menuIcons";
import { useMenuActions } from "@/hooks/useMenuActions";
import SideBar from "./SideBar";
import SearchSideBar from "./SearchSideBar";
import Notifications from "./Notifications";

type FooterMenuItem = Pick<(typeof menuItems)[0], "href" | "label" | "action">;

const footerMenuItems: FooterMenuItem[] = menuItems.map(({ href, label, action }) => ({
  href,
  label,
  action,
}));

export default function Footer() {
  const { handleMenuItemClick, isSidebarOpen, setIsSidebarOpen, activeSidebarContent } =
    useMenuActions();

  return (
    <>
      <footer className="z-0 text-textGrayColor flex flex-col gap-[48px] items-center pt-5 pb-[61px] ml-[245px] h-[158px] 2xl:mr-[245px] bg-primary">
        <nav className="flex gap-[40px] justify-center">
          {footerMenuItems.map((item, index) => (
            <div key={index} onClick={() => handleMenuItemClick(item)} className="cursor-pointer">
              {item.action === "link" ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
            </div>
          ))}
        </nav>
        <p>© 2024 ICHgram</p>
      </footer>

      <SideBar toggleSidebar={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        {activeSidebarContent === "/search" && (
          <SearchSideBar onClose={() => setIsSidebarOpen(false)} />
        )}
        {activeSidebarContent === "/notifications" && <Notifications />}
      </SideBar>
    </>
  );
}
