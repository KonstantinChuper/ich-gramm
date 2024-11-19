import { useState } from "react";
import { MenuItem } from "@/types/MenuItems";

export const useMenuActions = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSidebarContent, setActiveSidebarContent] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleMenuItemClick = (item: MenuItem) => {
    switch (item.action) {
      case "toggleSidebar":
        setIsSidebarOpen((prev) => (activeSidebarContent === item.href ? !prev : true));
        setActiveSidebarContent(item.href);
        break;
      case "toggleModal":
        setIsCreateModalOpen(true);
        break;
      case "link":
        setIsSidebarOpen(false);
        break;
    }
    return {
      isSidebarOpen,
      activeSidebarContent,
      isCreateModalOpen,
    };
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
