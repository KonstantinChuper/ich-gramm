"use client";

import { useEffect } from "react";
import { menuItems } from "@/components/icons/menu/menuIcons";
import { usePathname } from "next/navigation";
import { useMenuActions } from "@/hooks/useMenuActions";
import { useUnreadMessages } from "@/contexts/UnreadMessageContext";
import { useNotificationContext } from "@/contexts/NotificationContext";
import Link from "next/link";
import SideBar from "./SideBar";
import useUser from "@/hooks/useUser";
import HeroLogo from "@/components/icons/HeroLogo";
import ThemeToggle from "./ThemeToggle";
import ProfileBadge from "./ProfileBadge";
import SearchSideBar from "./SearchSideBar";
import Notifications from "./Notifications";
import CreatePostModal from "./ModalCreatePost";

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
        className="fixed w-16 md:w-[245px] h-full md:py-[14px] md:pl-[43px] border-r border-r-borderColor 
        border-b-0 overflow-auto z-50 bg-secondary px-4 pt-[60px]"
      >
        <nav className="space-y-7 fixed">
          <div className="md:flex items-center justify-between">
            <ThemeToggle />
            <Link href={"/"} className="max-w-[94px] max-h-[50px] md:block hidden">
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
                      <span
                        className="absolute -top-[6px] -right-2 bg-primaryColor text-white rounded-full w-4 h-4 flex items-center
                       justify-center text-xs"
                      >
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="hidden md:block">{item.label}</p>
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
                  <p className="hidden md:block">{item.label}</p>
                </button>
              )}
            </li>
          ))}
          <Link href={"/profile"} className="flex gap-4 items-center pt-[59px]">
            <ProfileBadge src={user?.profile_image || "/default-profile-image.svg"} />
            <p className={`${isProfilePage ? "font-bold" : "font-normal"} hidden md:block`}>
              Profile
            </p>
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
