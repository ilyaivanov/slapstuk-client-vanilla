type valueof<T> = T[keyof T];

type Item = {
  id: string;
  title: string;
  children: string[];
  isOpenFromSidebar?: boolean;
};

type Items = {
  [key: string]: Item;
};
