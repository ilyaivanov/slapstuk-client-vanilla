import * as controller from "./controller";

var player: any;
var videoRequested: string | undefined;
var isLoadingPlayer = false;
var isReady = false;

declare const YT: any;

export function play(videoId: string) {
  videoRequested = videoId;
  if (!player && !isLoadingPlayer) init();
  else if (isReady) {
    player.loadVideoById(videoId);
  }
}

function init() {
  isLoadingPlayer = true;
  const tag = document.createElement("script");

  tag.src = "https://www.youtube.com/iframe_api";
  const firstScriptTag = document.getElementsByTagName("script")[0];
  //@ts-ignore
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

//@ts-ignore
global.onYouTubeIframeAPIReady = () => {
  isLoadingPlayer = false;
  console.log("player ready", videoRequested);
  player = new YT.Player("youtubePlayer", {
    height: "100%",
    width: "100%",
    videoId: videoRequested,
    playerVars: { autoplay: 1 /*, 'controls': 0 */ },
    events: {
      onReady: () => {
        isReady = true;
      },
      onStateChange: onPlayerStateChange,
    },
  });
};

function onPlayerStateChange(event: any) {
  if (event.data === YT.PlayerState.ENDED) {
    controller.onVideoEnd();
  }
}
