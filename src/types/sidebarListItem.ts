export type DropdownItem = {
  name: string;
  path: string;
  icon?:string;
};

export type ListItem = {
  icon: string;
  name: string;
  path?: string;
  dropdown?: DropdownItem[]; 
};
