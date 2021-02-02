// import * as app from "./app";
// import * as api from "./api/controller";
import * as gallery from "./gallery1/gallery";
import { cls, dom } from "./infra";
import "./app.style";
// import "./gallery/style";
import { toggleVisibility, togleRightSidebar } from "./sidebar/controller";
import * as player from "./player/controller";
import * as gallery1 from "./gallery1/gallery";
import * as items from "./items";
// api.addEventListener("login", app.initApp);
// api.addEventListener("logout", app.initLogin);

// api.init();
// app.init();
const getItems = (count: number): Item[] =>
  [
    {
      id: "f1",
      title:
        "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout #23",
      videoId: "Cp4Rxh1ZqzA",
      type: "YTvideo" as const,
    },
    {
      id: "f2",
      title:
        "Deep House Music Live Mix 2021 Stream by Pete Bellis & Tommy #DeepDiscoRecords",
      videoId: "Pg4q1uYuQ7w",
      type: "YTvideo" as const,
    },
    {
      id: "f3",
      title:
        "The Good Life Radio • 24/7 Live Radio | Best Relax House, Chillout, Study, Running, Gym, Happy Music",
      videoId: "36YnV9STBqc",
      type: "YTvideo" as const,
    },
    {
      id: "f4",
      title:
        "Deep & Elegant Vibes • Deep House Mix [Gentleman Selection Vol.4]",
      videoId: "Uj6shBUMZa4",
      type: "YTvideo" as const,
    },
  ]
    .slice(0, count)
    .map((i) => ({
      ...i,
      id: "Dummy_" + Math.random(),
    }));

const itemsToRender: Item[] = [
  {
    id: "folderBig1",
    title:
      "Long and open folder with a big a long title (three rows indeed and for sure, just to make sure)",
    type: "folder",
    isOpenInGallery: true,
    children: [],
  },
  {
    id: "pClvXOmD",
    title: "Deep House Mix 2020 Vol.1 | Mixed By TSG",
    videoId: "cnVPm1dGQJc",
    type: "YTvideo",
  },
  {
    id: "mS1NqX8h",
    title: "2017 Personality and Its Transformations (University of Toronto)",
    type: "YTplaylist",
    playlistId: "PL22J3VaeABQApSdW8X71Ihe34eKN6XhCi",
    image: "https://i.ytimg.com/vi/kYYJlNbV1OM/mqdefault.jpg",
    children: [],
  },
  {
    id: "folder0",
    title: "My Folder Without Items",
    type: "folder",
    children: [],
  },
  {
    id: "folder1",
    title: "My Folder With One Item",
    type: "folder",
    children: [],
  },
  {
    id: "folder2",
    title: "My Folder With Two Items",
    type: "folder",
    children: [],
  },
  {
    id: "folder3",
    title: "My Folder With Three Items",
    type: "folder",
    children: [],
  },
  {
    id: "folder4",
    title: "My Folder With Four Items",
    type: "folder",
    children: [],
  },
  {
    id: "folderBig2",
    title: "Long and open",
    type: "folder",
    isOpenInGallery: true,
    children: [],
  },
  {
    id: "BiHZ8AU1",
    title:
      "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout #23",
    videoId: "Cp4Rxh1ZqzA",
    type: "YTvideo",
  },
  {
    id: "vsauceChannel",
    title: "Vsauce",
    type: "YTchannel",
    channelId: "UC6nSFpj9HTCZ5t-N3Rm3-HA",
    isOpenInGallery: false,
    image:
      "https://yt3.ggpht.com/ytc/AAUvwnhZ3RdTd90CWLjszcugYGMU4I72zJAVkphAfSflTQ=s240-c-k-c0xffffffff-no-rj-mo",
    children: [],
  },
  {
    id: "qCB7ZnJe",
    title: "Better Ideas",
    type: "YTchannel",
    channelId: "UCtUId5WFnN82GdDy7DgaQ7w",
    image:
      "https://yt3.ggpht.com/ytc/AAUvwnirbpqnd7FV8ShzIbByyOesFZLgwwIwl8luimDv=s240-c-k-c0xffffffff-no-rj-mo",
    children: [],
  },
  {
    id: "6D8s5H2x",
    title: "Game Dev Underground",
    type: "YTchannel",
    channelId: "UC_hwKJdF3KRAy4QIaiCSMgQ",
    image:
      "https://yt3.ggpht.com/ytc/AAUvwniy9KFBYG7mzeqZtl3JDGCOH2sZzmMflc3Y1f8aZA=s240-c-k-c0xffffffff-no-rj-mo",
    children: [],
  },
  {
    id: "EELN0Xv_",
    title:
      "Deep House Music Live Mix 2021 Stream by Pete Bellis & Tommy #DeepDiscoRecords",
    videoId: "Pg4q1uYuQ7w",
    type: "YTvideo",
  },
  {
    id: "GwJ7EWi-",
    title:
      "The Good Life Radio • 24/7 Live Radio | Best Relax House, Chillout, Study, Running, Gym, Happy Music",
    videoId: "36YnV9STBqc",
    type: "YTvideo",
  },
  {
    id: "qpeciQyF",
    title:
      "Mega Hits 2020 🌱 The Best Of Vocal Deep House Music Mix 2020 🌱 Summer Music Mix 2020 #96",
    videoId: "-RkQDlUV4Fc",
    type: "YTvideo",
  },
  {
    id: "wjKf8ByV",
    title: "Deep & Elegant Vibes • Deep House Mix [Gentleman Selection Vol.4]",
    videoId: "Uj6shBUMZa4",
    type: "YTvideo",
  },
  {
    id: "E7DTM9cl",
    title: "Best of Vocal Deep House Mix by GR Relaxing Music",
    videoId: "lZOgjUfGTWA",
    type: "YTvideo",
  },
  {
    id: "8MJP165j",
    title: "Deep & Smooth - Elegant Deep House Mix ' 2021",
    videoId: "WoU-X3HDZcU",
    type: "YTvideo",
  },
  {
    id: "BTbMd79H",
    title: "♫ Best Deep House Mix 2018 Vol. #1 ♫",
    videoId: "cvRbhpvnUuc",
    type: "YTvideo",
  },
  {
    id: "Bt5n-fiy",
    title:
      "Ibiza Summer Mix 2020 🍓 Best Of Tropical Deep House Music Chill Out Mix By Deep Legacy #41",
    videoId: "dXHkMpPjDhc",
    type: "YTvideo",
  },
  {
    id: "uvTNbu6D",
    title:
      "Mega Hits 2020 🌱 The Best Of Vocal Deep House Music Mix 2020 🌱 Summer Music Mix 2020 #96",
    videoId: "tHc80hfVddM",
    type: "YTvideo",
  },
  {
    id: "qwDcu7ry",
    title:
      "Relaxing Deep House Mix (Zhu, CamelPhat, Meduza, Disicples, Elderbrook) | Ark's Anthems Vol 44",
    videoId: "qB0HDGxjnZI",
    type: "YTvideo",
  },
  {
    id: "YzKxg1nR",
    title: "'Midnight Journey' - Relaxing Deep House & Progressive House Mix",
    videoId: "iIhOfk5IEQg",
    type: "YTvideo",
  },
  {
    id: "OGpTgXR2",
    title:
      "Mega Hits 2020 🌱 The Best Of Vocal Deep House Music Mix 2020 🌱 Summer Music Mix 2020 #8",
    videoId: "htrxWYQayk0",
    type: "YTvideo",
  },
  {
    id: "d5c8Nc43",
    title:
      "The Best Of Vocal Deep House Chill Out Music 2015 (2 Hour Mixed By Regard ) #1",
    videoId: "Z-LyvotnXBA",
    type: "YTvideo",
  },
  {
    id: "KL5k6P-z",
    title: "Deep House Mix 2021 · For A Better Year | Grau DJ",
    videoId: "YlXitKQi9UU",
    type: "YTvideo",
  },
  {
    id: "AaOV0Zo9",
    title:
      "4K Summer Hits 2020 🌱 The Best Of Vocal Deep House Music Mix 2020 🌱 Ibiza Music Mix 2020 #33",
    videoId: "JrLCvai2agQ",
    type: "YTvideo",
  },
  {
    id: "AffdqaOz",
    title: "DEEP CHILLS 2020 ❄️ (Deep House / Chill Nation Mix)",
    videoId: "eaM9tST8Xuc",
    type: "YTvideo",
  },
  {
    id: "fLt3XK2v",
    title: "South African Soulful Deep House | (Sunday Sessions Study Mix)",
    videoId: "lafcdurtUq8",
    type: "YTvideo",
  },
  {
    id: "r5qvnYBW",
    title:
      "Mega Hits 2020 🌱 The Best Of Vocal Deep House Music Mix 2020 🌱 Summer Music Mix 2020 #8",
    videoId: "DGEsKqdOFkM",
    type: "YTvideo",
  },
  {
    id: "GSWckjuZ",
    title: "Gentleman 'Deep' Radio - Deep House • Chillout • Dub Techno 24/7",
    videoId: "2W3VbZfDBpk",
    type: "YTvideo",
  },
  {
    id: "Qjh8b24F",
    title:
      "Deep House Radio • 24/7 Live Radio | Vocal Deep House & Chill House Music",
    videoId: "ZR5yOX_8Vdo",
    type: "YTvideo",
  },
  {
    id: "5mKmXfat",
    title:
      "Deep Feelings Mix - Deep House, Vocal House, Nu Disco, Chillout #77",
    videoId: "2d9mW9YLEqw",
    type: "YTvideo",
  },
  {
    id: "VrNK-JrO",
    title: "Deep House Mix 2021 · Midnight City | Grau DJ",
    videoId: "CbGSMHzDsIk",
    type: "YTvideo",
  },
  {
    id: "K5RF-tA2",
    title: "I Get Deeper - Deep House Mix [Gentleman Midnight Selection Vol.1]",
    videoId: "blDoFLLPucY",
    type: "YTvideo",
  },
  {
    id: "LVsKEMY0",
    title:
      "Phil Collins - In The Air Tonight ('Panski & John Skyfield Remix) [Deep House]",
    videoId: "AbWBviQCMEE",
    type: "YTvideo",
  },
  {
    id: "sE073wmS",
    title: "Deep House Mix 2021 · Midnight City | Grau DJ",
    videoId: "CbGSMHzDsIk",
    type: "YTvideo",
  },
  {
    id: "luSM4un2",
    title:
      "Best Of Tropical & Deep House Music 2020 Chill Out Mix | Best Summer Hits",
    videoId: "0D0LMWf93pU",
    type: "YTvideo",
  },
  {
    id: "rbX3Lw2X",
    title: "Deep Emotions 2021 | Deep House • Nu Disco • Chill House Mix",
    videoId: "KffrGzuFqQY",
    type: "YTvideo",
  },
  {
    id: "n9ge580K",
    title:
      "4K Mega Hits - The Best Of Deep Vocal Deep House Music Mix 2020 - Summer Music Mix 2020",
    videoId: "sIpr609j994",
    type: "YTvideo",
  },
  {
    id: "Zk1CS6L6",
    title:
      "Deep Legacy. Radio • 24/7 Music Live Stream | Deep & Tropical House, Chill Out, Dance Music, EDM",
    videoId: "3_bBHMfT6Xk",
    type: "YTvideo",
  },
  {
    id: "2_aR915M",
    title:
      "House Relax 2019 (New and Best Deep House Music | Chill Out Mix #15)",
    videoId: "qSKK76h6h54",
    type: "YTvideo",
  },
  {
    id: "7nQqQI0A",
    title: "house & deep house classics vinyl mix",
    videoId: "XlVd82QgACg",
    type: "YTvideo",
  },
  {
    id: "TyQrIs6H",
    title: "LONDON deep house session FEBRUARY 2018",
    videoId: "bnMnVl1DAkw",
    type: "YTvideo",
  },
  {
    id: "IE02uY29",
    title: "'Night Drive' Pt. 3 - Relaxing Deep House & Progressive House Mix",
    videoId: "VSjTcTo5sn8",
    type: "YTvideo",
  },
  {
    id: "dYk0R5Ht",
    title: "Deep Emotions ' Deep House ' Relax Mix 2021",
    videoId: "bN0chxMTgqg",
    type: "YTvideo",
  },
  {
    id: "twgLDQYd",
    title: "RUSSIAN DEEP HOUSE MIX | SUKA.",
    videoId: "MD2JZTeTSIU",
    type: "YTvideo",
  },
  {
    id: "kgz7sVWS",
    title: "Deep Emotions | Deep House 2021 Mix",
    videoId: "B9wNueQFVqw",
    type: "YTvideo",
  },
  {
    id: "W7jx7rmx",
    title: "Sweet Dreams (Deep House Remix)",
    videoId: "nYBGBi8fdnk",
    type: "YTvideo",
  },
  {
    id: "CU5WkZU1",
    title:
      "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout #94",
    videoId: "6slSVoNEBXA",
    type: "YTvideo",
  },
  {
    id: "0f9ef0Ca",
    title:
      "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout #16",
    videoId: "B5mimngffGQ",
    type: "YTvideo",
  },
  {
    id: "jxlhuTCI",
    title: "South African House Music Mix | Mixed by DJ TKM",
    videoId: "faYiML2OVLI",
    type: "YTvideo",
  },
  {
    id: "dqHz39FC",
    title: "Deep In Quarantine 01 | Deep House Set | 2020 Mixed By Johnny M",
    videoId: "qBKKCvn5C0Y",
    type: "YTvideo",
  },
  {
    id: "WWZyYq9I",
    title: "Luxury Deep Vibes • Deep House Mix [Gentleman Selection Vol.4]",
    videoId: "abk_e4SvNBU",
    type: "YTvideo",
  },
  {
    id: "Z27B5yny",
    title:
      "Deep Feelings Mix - Deep House, Vocal House, Nu Disco, Chillout #72",
    videoId: "V5Ta3n2NWu4",
    type: "YTvideo",
  },
  {
    id: "T3m2MGEw",
    title:
      "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout #93",
    videoId: "9B-mFSZEzA8",
    type: "YTvideo",
  },
  {
    id: "Di3Q8Ts-",
    title: "Deep Feelings Mix | Deep House, Vocal House, Nu Disco, Chillout",
    videoId: "POlUVXZYc-Q",
    type: "YTvideo",
  },
  {
    id: "49qUHD6g",
    title: "Deep House Start To Finish | Ep. 3 - The Drop",
    videoId: "dlx5XWYLryY",
    type: "YTvideo",
  },
  {
    id: "sQ9-Ue0A",
    title:
      "4K Santorini Summer Mix 2020 🍓 Best Of Tropical Deep House Music Chill Out Mix By Deep Mix #5",
    videoId: "CwxIlPdX5ZI",
    type: "YTvideo",
  },
  {
    id: "DFe7A_w_",
    title:
      "Deep In The Groove | Deep House Set | DEM Radio Podcast | 2021 Mixed By Johnny M",
    videoId: "WpDbaAiX8Ao",
    type: "YTvideo",
  },
];
items.setSearchItems(itemsToRender);
items.setChildren("folder1", getItems(1));
items.setChildren("folder2", getItems(2));
items.setChildren("folder3", getItems(3));
items.setChildren("folder4", getItems(4));
items.setChildren(
  "folderBig1",
  Array.from(new Array(12))
    .map(() => getItems(4))
    .flat()
);
items.setChildren(
  "folderBig2",
  Array.from(new Array(12))
    .map(() => getItems(4))
    .flat()
);
const root = dom.findById("root");
root.appendChild(
  dom.div({
    className: cls.page,
    children: [
      {
        className: cls.header,
        children: [
          {
            type: "button",
            on: {
              click: () => {
                toggleVisibility();
                setTimeout(() => {
                  gallery1.rerenderIfColumnsChanged();
                }, 200);
              },
            },
            children: "left",
          },
          {
            type: "button",
            on: {
              click: () => {
                togleRightSidebar();
                setTimeout(() => {
                  gallery1.rerenderIfColumnsChanged();
                }, 200);
              },
            },
            children: "right",
          },
          {
            type: "button",
            on: { click: player.toggleVisibility },
            children: "player",
          },
        ],
      },
      { className: [cls.sidebar, cls.sidebarHidden] },
      { className: cls.gallery },
      { className: [cls.rightSidebar, cls.rightSidebarHidden] },
      { className: cls.player },
    ],
  })
);

gallery.renderItems(itemsToRender);
