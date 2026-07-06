export type NavItem = {
  id: string;
  label: string;
  href: string;
  icon: string;
  description?: string;
  badge?: string;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};
