import { isIsolated } from "../infra";
import * as fakeAPI from "./fakeYoutubeService";

const API_HOST = "https://europe-west1-slapstuk.cloudfunctions.net";
// const API_HOST = "http://localhost:5001/slapstuk/europe-west1";

export const findYoutubeVideos = (
  term: string,
  pageToken?: string
): Promise<YoutubeSearchResponse> => {
  if (isIsolated)
    return Promise.resolve(fakeAPI.sampleResponseWithChannelsAndPlaylists);
  verifyNonTextEnvironment();
  let url = `${API_HOST}/getVideos?q=${term}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

export const fetchPlaylistVideos = (
  playlistId: string,
  pageToken?: string
): Promise<YoutubePlaylistDetailsResponse> => {
  if (isIsolated)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(fakeAPI.samplePlaylistDetailsWithChannelsAndPlaylists);
      }, 2000);
    });

  verifyNonTextEnvironment();
  let url = `${API_HOST}/getPlaylistItems?playlistId=${playlistId}`;

  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

export const getChannelPlaylists = (channelId: string, pageToken?: string) => {
  verifyNonTextEnvironment();
  let url = `${API_HOST}/getChannelPlaylists?part=snippet&channelId=${channelId}`;
  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

export const getChannelUploadsPlaylistId = (
  channelId: string
): Promise<string> => {
  verifyNonTextEnvironment();
  let url = `${API_HOST}/getChannelVideos?channelId=${channelId}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      console.log(res);
      return res.playlistId;
    });
};

export const findSimilarYoutubeVideos = (
  videoId: string,
  pageToken?: string
) => {
  verifyNonTextEnvironment();
  let url = `${API_HOST}/getVideos?relatedToVideoId=${videoId}&type=video`;

  if (pageToken) url += `&pageToken=${pageToken}`;
  return fetch(url).then((res) => res.json());
};

const verifyNonTextEnvironment = () => {
  if (process.env.NODE_ENV === "test")
    throw new Error("Tried to execute real API call from tests");
};

export type YoutubeSearchResponse = {
  items: ResponseItem[];
};

export type YoutubePlaylistDetailsResponse = {
  items: ResponseItem[];
};

export type ResponseItem =
  | VideoResponseItem
  | ChannelResponseItem
  | PlaylistResponseItem;

export type VideoResponseItem = {
  itemType: "video";
  id: string;
  image: string;
  channelTitle: string;
  channelId: string;
  itemId: string;
  name: string;
};
export type ChannelResponseItem = {
  itemType: "channel";
  id: string;
  image: string;
  itemId: string;
  name: string;
};
export type PlaylistResponseItem = {
  itemType: "playlist";
  id: string;
  image: string;
  itemId: string;
  name: string;
  channelTitle: string;
  channelId: string;
};
