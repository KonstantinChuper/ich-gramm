"use client";

import { useEffect, useState } from "react";
import heroLogo from "@/assets/hero-logo.svg";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "@/data/menuItems";
import ProfileBadge from "./ProfileBadge";
import SideBar from "./SideBar";
import SearchSideBar from "./SearchSideBar";
import Notifications from "./Notifications";
import useUser from "@/hooks/useUser";
import CreatePostModal from "./ModalCreatePost";
import { useUnreadMessages } from "@/contexts/UnreadMessageContext";
import { useNotificationContext } from "@/contexts/NotificationContext";

export default function AsideMenu() {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarContent, setActiveSidebarContent] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const isProfilePage = pathname === "/profile" || pathname === "/profile/edit";
  const { fetchUser, user } = useUser();
  const { unreadCount } = useUnreadMessages();
  const { unreadCount: unreadNotifications } = useNotificationContext();

  const handleToggleSidebar = (contentId: string) => {
    setIsSidebarOpen((prev) => (activeSidebarContent === contentId ? !prev : true));
    setActiveSidebarContent(contentId);
  };

  useEffect(() => {
    if (pathname === "/profile") {
      fetchUser();
    }
  }, [pathname]);

  const handleItemClick = (item: (typeof menuItems)[0]) => {
    switch (item.action) {
      case "toggleSidebar":
        handleToggleSidebar(item.href);
        break;
      case "toggleModal":
        setIsCreateModalOpen(true);
        break;
      case "link":
        setIsSidebarOpen(false);
        break;
    }
  };

  const handleAsideClick = () => {
    if (isCreateModalOpen) {
      setIsCreateModalOpen(false);
    }
    const event = new CustomEvent("closePostModal");
    window.dispatchEvent(event);
  };

  return (
    <div className="relative z-50">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black opacity-65 z-30"
        ></div>
      )}
      <CreatePostModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
      <aside
        onClick={handleAsideClick}
        className="fixed md:block md:w-[245px] md:h-full md:py-[14px] md:pl-[43px] border-r border-r-borderColor border-b-0 overflow-auto z-50 bg-secondary"
      >
        <nav className="space-y-7 fixed">
          <Link href={"/"} className="max-w-[94px] max-h-[50px]">
            <Image src={heroLogo} width={90} height={50} alt="heroLogo" />
          </Link>
          {menuItems.map((item) => (
            <li key={item.href} className="flex items-center">
              {item.action === "link" ? (
                <Link
                  href={item.href}
                  className={`text-sm flex items-center gap-4 ${
                    pathname === item.href && !isSidebarOpen ? "font-bold" : ""
                  }`}
                  onClick={() => handleItemClick(item)}
                >
                  <div className="relative">
                    <Image
                      src={
                        pathname === item.href && !isSidebarOpen
                          ? item.icon.filled
                          : item.icon.default
                      }
                      alt={`${item.label} Icon`}
                      width={22}
                      height={22}
                    />
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
                  onClick={() => handleItemClick(item)}
                  className={`text-sm flex items-center gap-4 relative ${
                    activeSidebarContent === item.href && isSidebarOpen ? "font-bold" : ""
                  }`}
                >
                  <div className="relative">
                    <Image
                      src={
                        activeSidebarContent === item.href && isSidebarOpen
                          ? item.icon.filled
                          : item.icon.default
                      }
                      alt={`${item.label} Icon`}
                      width={22}
                      height={22}
                    />
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
      <SideBar toggleSidebar={isSidebarOpen}>
        {activeSidebarContent === "/search" && (
          <SearchSideBar onClose={() => setIsSidebarOpen(false)} />
        )}
        {activeSidebarContent === "/notifications" && <Notifications />}
      </SideBar>
    </div>
  );
}
