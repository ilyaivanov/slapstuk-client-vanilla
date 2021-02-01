export const sampleResponseWithChannelsAndPlaylists = {
  items: [
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendChannel(),
    sampleBackendItem(),
    sampleBackendPlaylist(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
  ],
};

export const samplePlaylistDetailsWithChannelsAndPlaylists = {
  items: [
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
    sampleBackendItem(),
  ],
};

function sampleBackendItem() {
  return {
    id: "TEST" + Math.random(),
    image: "https://i.ytimg.com/vi/8ONz3_vjJIY/mqdefault.jpg",
    channelTitle: "The Psychedelic Muse",
    channelId: "UCAepXw94EhaO0CZV9f5D3fQ",
    itemId: "8ONz3_vjJIY",
    name: "Sync24 - Omnious [Full Album]",
    itemType: "video",
  } as const;
}

function sampleBackendPlaylist() {
  return {
    id: "TEST" + Math.random(),
    image: "https://i.ytimg.com/vi/3QMvfdXRbm4/mqdefault.jpg",
    itemId: "PLrz8hHdG8-5BaFU3C8-klOA4L6ws-Lw_b",
    name: "Sync24 - Source | Leftfield Records [Full Album]",
    channelTitle: "Chill Space",
    channelId: "UCNHbHR2KOc851Kkb_TJ2Orw",
    itemType: "playlist",
  } as const;
}

function sampleBackendChannel() {
  return {
    id: "TEST" + Math.random(),
    image:
      "https://yt3.ggpht.com/ytc/AAUvwniJ6-RupADgyZPeOf8RqQV6WKcxXHS1JS0b8lOBhg=s240-c-k-c0xffffffff-no-rj-mo",
    itemId: "UCL_f53ZEJxp8TtlOkHwMV9Q",
    name: "Jordan B Peterson",
    itemType: "channel",
  } as const;
}
