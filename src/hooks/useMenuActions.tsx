import { useState } from "react";
import { MenuItem } from "@/types/MenuItems";

export const useMenuActions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarContent, setActiveSidebarContent] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleMenuItemClick = (item: MenuItem) => {
    switch (item.action) {
      case "toggleSidebar":
        if (activeSidebarContent === item.href) {
          setIsSidebarOpen((prev) => !prev);
          if (isSidebarOpen) {
            setActiveSidebarContent(null);
          }
        } else {
          setIsSidebarOpen(true);
          setActiveSidebarContent(item.href);
        }
        break;
      case "toggleModal":
        setIsCreateModalOpen(true);
        break;
      case "link":
        setIsSidebarOpen(false);
        break;
    }
  };

  return {
    handleMenuItemClick,
    isSidebarOpen,
    setIsSidebarOpen,
    activeSidebarContent,
    isCreateModalOpen,
    setIsCreateModalOpen,
  };
};
