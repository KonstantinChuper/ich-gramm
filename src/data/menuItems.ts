import homeIcon from "@/assets/menu-icons/home.svg";
import searchIcon from "@/assets/menu-icons/search.svg";
import exploreIcon from "@/assets/menu-icons/explore.svg";
import messagesIcon from "@/assets/menu-icons/messages.svg";
import notificationsIcon from "@/assets/menu-icons/notification.svg";
import homeIconFilled from "@/assets/menu-icons/home-filled.svg";
import searchIconFilled from "@/assets/menu-icons/search-filled.svg";
import exploreIconFilled from "@/assets/menu-icons/explore-filled.svg";
import messagesIconFilled from "@/assets/menu-icons/messages-filled.svg";
import notificationsIconFilled from "@/assets/menu-icons/notification-filled.svg";
import createIcon from "@/assets/menu-icons/create.svg";

export const menuItems = [
  {
    href: "/",
    icon: { default: homeIcon, filled: homeIconFilled },
    label: "Home",
    action: "link",
  },
  {
    href: "/search",
    icon: { default: searchIcon, filled: searchIconFilled },
    label: "Search",
    action: "toggleSidebar",
  },
  {
    href: "/explore",
    icon: { default: exploreIcon, filled: exploreIconFilled },
    label: "Explore",
    action: "link",
  },
  {
    href: "/messages",
    icon: { default: messagesIcon, filled: messagesIconFilled },
    label: "Messages",
    action: "link",
  },
  {
    href: "/notifications",
    icon: { default: notificationsIcon, filled: notificationsIconFilled },
    label: "Notifications",
    action: "toggleSidebar",
  },
  {
    href: "/create",
    icon: { default: createIcon, filled: createIcon },
    label: "Create",
    action: "link",
  },
];
