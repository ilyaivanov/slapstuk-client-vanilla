type valueof<T> = T[keyof T];

type Item = {
  id: string;
  title: string;
  image?: string;
  videoId?: string;
  children: string[];
  isOpenFromSidebar?: boolean;
  isOpenInGallery?: boolean;
};

type Items = {
  [key: string]: Item;
};
