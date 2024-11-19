"use client";

import { useEffect } from "react";
import HeroLogo from "@/components/icons/HeroLogo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/components/icons/menu/menuIcons";
import ProfileBadge from "./ProfileBadge";
import SideBar from "./SideBar";
import SearchSideBar from "./SearchSideBar";
import Notifications from "./Notifications";
import useUser from "@/hooks/useUser";
import CreatePostModal from "./ModalCreatePost";
import { useUnreadMessages } from "@/contexts/UnreadMessageContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import ThemeToggle from "./ThemeToggle";
import { useMenuActions } from "@/hooks/useMenuActions";

export default function AsideMenu() {
  const pathname = usePathname();
  const isProfilePage = pathname === "/profile" || pathname === "/profile/edit";
  const { fetchUser, user } = useUser();
  const { unreadCount } = useUnreadMessages();
  const { unreadCount: unreadNotifications } = useNotificationContext();
  const {
    handleMenuItemClick,
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebarContent,
    isCreateModalOpen,
    setIsCreateModalOpen,
  } = useMenuActions();

  useEffect(() => {
    if (pathname === "/profile") {
      fetchUser();
    }
  }, [pathname]);

  const handleAsideClick = () => {
    if (isCreateModalOpen) {
      setIsCreateModalOpen(false);
    }
    const event = new CustomEvent("closePostModal");
    window.dispatchEvent(event);
  };

  return (
    <div className="relative z-50">
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <aside
        onClick={handleAsideClick}
        className="fixed md:block md:w-[245px] md:h-full md:py-[14px] md:pl-[43px] border-r border-r-borderColor border-b-0 overflow-auto z-50 bg-secondary"
      >
        <nav className="space-y-7 fixed">
          <div className="flex items-center justify-between">
            <ThemeToggle />
            <Link href={"/"} className="max-w-[94px] max-h-[50px]">
              <HeroLogo />
            </Link>
          </div>
          {menuItems.map((item) => (
            <li key={item.href} className="flex items-center">
              {item.action === "link" ? (
                <Link
                  href={item.href}
                  className={`text-sm flex items-center gap-4 ${
                    pathname === item.href && !isSidebarOpen ? "font-bold" : ""
                  }`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <div className="relative">
                    <item.Icon isFilled={pathname === item.href && !isSidebarOpen} />
                    {item.label === "Messages" && unreadCount > 0 && (
                      <span className="absolute -top-[6px] -right-2 bg-primaryColor text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  {item.label}
                </Link>
              ) : (
                <button
                  onClick={() => handleMenuItemClick(item)}
                  className={`text-sm flex items-center gap-4 relative ${
                    activeSidebarContent === item.href && isSidebarOpen ? "font-bold" : ""
                  }`}
                >
                  <div className="relative">
                    <item.Icon isFilled={activeSidebarContent === item.href && isSidebarOpen} />
                    {item.label === "Notifications" && unreadNotifications > 0 && (
                      <span className="absolute -top-[6px] -right-2 bg-primaryColor text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                  {item.label}
                </button>
              )}
            </li>
          ))}
          <Link href={"/profile"} className="flex gap-4 items-center pt-[59px]">
            <ProfileBadge src={user?.profile_image || "/default-profile-image.svg"} />
            <p className={`${isProfilePage ? "font-bold" : "font-normal"}`}>Profile</p>
          </Link>
        </nav>
      </aside>
      <SideBar toggleSidebar={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
        {activeSidebarContent === "/search" && (
          <SearchSideBar onClose={() => setIsSidebarOpen(false)} />
        )}
        {activeSidebarContent === "/notifications" && <Notifications />}
      </SideBar>
    </div>
  );
}
