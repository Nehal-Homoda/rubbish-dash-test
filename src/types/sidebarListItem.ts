export type ListItem = {
  icon?: string;
  name: string;
  path?: string;
  iconType?: "mdi" | "fa";
  dropdown?: ListItem[];
};
