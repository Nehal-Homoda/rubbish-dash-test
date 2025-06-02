export type ListItem = {
  icon?: string;
  name: string;
  path?: string;
  iconType?: "mdi" | "fa";
  subLinks?: ListItem[];
};
