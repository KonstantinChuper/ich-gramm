import { MENU_ICONS } from "./constants/images";

interface MenuItem {
  href: string;
  label: string;
  Icon?: React.ReactNode;
  icon?: {
    default: string;
    filled: string;
  };
  action: "link" | "toggleSidebar" | "toggleModal";
}

export const menuItems: MenuItem[] = [
  {
    href: "/",
    icon: MENU_ICONS.HOME,
    label: "Home",
    action: "link",
  },
  {
    href: "/search",
    icon: MENU_ICONS.SEARCH,
    label: "Search",
    action: "toggleSidebar",
  },
  {
    href: "/explore",
    icon: MENU_ICONS.EXPLORE,
    label: "Explore",
    action: "link",
  },
  {
    href: "/messages",
    icon: MENU_ICONS.MESSAGES,
    label: "Messages",
    action: "link",
  },
  {
    href: "/notifications",
    icon: MENU_ICONS.NOTIFICATIONS,
    label: "Notifications",
    action: "toggleSidebar",
  },
  {
    href: "/create",
    icon: MENU_ICONS.CREATE,
    label: "Create",
    action: "toggleModal",
  },
];
