export type ListItem = {
  icon?: string;
  name: string;
  text:string;
  path?: string;
  iconType?: "mdi" | "fa";
  subLinks?: ListItem[];
};
