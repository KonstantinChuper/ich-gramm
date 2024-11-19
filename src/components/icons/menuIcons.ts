import {
  HomeIcon,
  SearchIcon,
  ExploreIcon,
  MessagesIcon,
  NotificationsIcon,
  CreateIcon,
} from "@/components/icons/Icons";

export const menuItems = [
  {
    href: "/",
    Icon: HomeIcon,
    label: "Home",
    action: "link",
  },
  {
    href: "/search",
    Icon: SearchIcon,
    label: "Search",
    action: "toggleSidebar",
  },
  {
    href: "/explore",
    Icon: ExploreIcon,
    label: "Explore",
    action: "link",
  },
  {
    href: "/messages",
    Icon: MessagesIcon,
    label: "Messages",
    action: "link",
  },
  {
    href: "/notifications",
    Icon: NotificationsIcon,
    label: "Notifications",
    action: "toggleSidebar",
  },
  {
    href: "/create",
    Icon: CreateIcon,
    label: "Create",
    action: "toggleModal",
  },
];
