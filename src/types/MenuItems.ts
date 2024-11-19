interface MenuItem {
  href: string;
  Icon?: React.ComponentType<{ isFilled?: boolean }>;
  label: string;
  action: "link" | "toggleSidebar" | "toggleModal";
}

export type { MenuItem };
