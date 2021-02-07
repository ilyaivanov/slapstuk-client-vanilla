// import {
//   anim,
//   cls,
//   dom,
//   ids,
//   DivDefinition,
//   cssClass,
//   css,
//   styles,
//   ClassName,
// } from "../infra";
// import * as style from "./style";
// import * as player from "../player/controller";
// import * as items from "../items";
// import * as api from "../api/youtubeRequest";
// import { mapReponseItem } from "../search/controller";

// export const renderItems = (newItems: Item[]) => {
//   const gallery = dom.findFirstByClass(cls.gallery);
//   const preparedViews = dom.fragment(newItems.map(viewCard));

//   if (!dom.isEmpty(gallery)) {
//     //extract this to a crossfade animation
//     const from: Keyframe = {
//       opacity: 1,
//       transform: "translate3d(0, 0, 0)",
//     };
//     const toHide: Keyframe = {
//       opacity: 0,
//       transform: "translate3d(-20px, 0, 0)",
//     };
//     const toAppear: Keyframe = {
//       opacity: 0,
//       transform: "translate3d(20px, 0, 0)",
//     };

//     const animation = gallery.animate([from, toHide], {
//       fill: "forwards",
//       duration: style.galleryFadeSpeed,
//       easing: "ease-in",
//     });
//     animation.addEventListener("finish", () => {
//       renderGallery(preparedViews);
//       gallery.animate([toAppear, from], {
//         fill: "forwards",
//         duration: style.galleryFadeSpeed,
//         easing: "ease-out",
//       });
//     });
//   } else {
//     renderGallery(preparedViews);
//   }
// };

// const renderGallery = (views: Node) => {
//   const gallery = dom.findFirstByClass(cls.gallery);
//   gallery.innerHTML = "";

//   gallery.appendChild(views);
// };

// const toggleCardExpandCollapse = (item: ItemContainer) => {
//   if (items.isNeedsToBeLoaded(item)) {
//     const doneLoading = (newItems: Item[]) => {
//       if (item.type == "YTplaylist") {
//         item.isLoading = false;
//       } else if (item.type == "YTchannel") {
//         item.isLoading = false;
//       }
//       items.setChildren(item.id, newItems);
//       const card = dom.findById("card-" + item.id);
//       const cardSubtracksContainer = dom.findFirstByClass(
//         cls.subtracksContainer,
//         card
//       );
//       cardSubtracksContainer.innerHTML = "";
//       const subs = viewSubtracks(item.id);
//       cardSubtracksContainer.appendChild(dom.fragment(subs));
//     };
//     if (item.type == "YTplaylist") {
//       item.isLoading = true;
//       api
//         .fetchPlaylistVideos(item.playlistId)
//         .then((response) => response.items.map(mapReponseItem))
//         .then((newItems) => doneLoading(newItems));
//     }
//     if (item.type == "YTchannel") {
//       item.isLoading = true;
//       Promise.all([
//         api.getChannelPlaylists(item.channelId),
//         api.getChannelUploadsPlaylistId(item.channelId),
//       ])
//         .then(([channelPlaylists, uploadsPlaylistId]) =>
//           [
//             {
//               type: "YTplaylist",
//               children: [],
//               id: Math.random() + "",
//               image: item.image,
//               playlistId: uploadsPlaylistId,
//               title: item.title + " - Uploads",
//             } as Item,
//           ].concat(channelPlaylists.items.map(mapReponseItem))
//         )
//         .then((newItems) => doneLoading(newItems));
//     }
//   }
//   const card = dom.findById("card-" + item.id);
//   item.isOpenInGallery = !item.isOpenInGallery;
//   const cardImage = dom.findFirstByClass(cls.cardImage, card);
//   const cardSubtracksContainer = dom.findFirstByClass(
//     cls.subtracksContainer,
//     card
//   );
//   const content = items.isLoading(item)
//     ? viewSubtracksLoadingGrid()
//     : viewSubtracks(item.id);
//   if (item.isOpenInGallery) {
//     cardImage.classList.add(cls.cardImageHidden);
//     const gallery = dom.findFirstByClass(cls.gallery);
//     anim.openElementHeight(
//       cardSubtracksContainer,
//       content,
//       style.cardExpandCollapseSpeed,
//       () =>
//         Math.min(
//           gallery.clientHeight - style.gap * 2,
//           cardSubtracksContainer.scrollHeight
//         )
//     );
//   } else {
//     cardImage.classList.remove(cls.cardImageHidden);
//     anim.collapseElementHeight(
//       cardSubtracksContainer,
//       style.cardExpandCollapseSpeed
//     );
//   }
// };

// //VIEW
// export const viewCard = (item: Item): DivDefinition => ({
//   id: ids.card(item.id),
//   className: [
//     cls.card,
//     player.itemIdBeingPlayed == item.id ? cls.itemBeingPlayed : cls.none,
//   ],
//   children: [
//     {
//       className: cls.cardImageWithTextContainer,
//       on: {
//         click: () => {
//           if (items.isContainer(item)) toggleCardExpandCollapse(item);
//           else player.playItem(item.id);
//         },
//       },
//       children: [
//         folderPreview(item),
//         {
//           className: [
//             cls.cardText,
//             items.isContainer(item) && item.children.length > 0
//               ? cls.cardTextForFolder
//               : cls.none,
//           ],
//           children: item.title,
//         },
//       ],
//     },
//     {
//       className: cls.subtracksContainer,
//       children:
//         items.isContainer(item) && item.isOpenInGallery
//           ? viewSubtracks(item.id)
//           : [],
//     },
//     {
//       className: cls.cardTypeBox,
//       children: [
//         {
//           className: [
//             cls.cardTypeBoxTriangle,
//             items.isFolder(item)
//               ? cls.cardTypeBoxTriangleFolder
//               : items.isChannel(item)
//               ? cls.cardTypeBoxTriangleChannel
//               : items.isPlaylist(item)
//               ? cls.cardTypeBoxTrianglePlaylist
//               : cls.none,
//           ],
//         },
//         {
//           className: cls.cardTypeBoxTextContainer,
//           children: items.isFolder(item)
//             ? "F"
//             : items.isPlaylist(item)
//             ? "P"
//             : items.isChannel(item)
//             ? "C"
//             : "",
//         },
//       ],
//     },
//   ],
// });

// const viewSubtracks = (itemId: string) =>
//   items.getChildren(itemId).map(viewSubtrack);

// const viewSubtrack = (item: Item): DivDefinition => ({
//   id: ids.subtrack(item.id),
//   className: [
//     cls.subtrack,
//     player.itemIdBeingPlayed == item.id ? cls.itemBeingPlayed : cls.none,
//   ],
//   on: {
//     click: (e) => {
//       e.stopPropagation();
//       if (items.isVideo(item)) player.playItem(item.id);
//     },
//   },
//   children: [
//     {
//       type: "img",
//       className: cls.subtrackImage,
//       attributes: { src: items.getFirstImage(item) },
//     },
//     { type: "span", children: item.title },
//   ],
// });

// const folderPreview = (item: Item): DivDefinition => {
//   console.log(item)
//   const children = items.getChildren(item.id);

//   const containerClasses: ClassName[] = [
//     cls.cardImage,
//     items.isContainer(item) && item.isOpenInGallery
//       ? cls.cardImageHidden
//       : cls.none,
//   ];

//   if (!items.isFolder(item) || children.length == 1) {
//     let src = !items.isFolder(item)
//       ? items.getImageSrc(item)
//       : items.getPreviewImages(item);
//     return {
//       type: "img",
//       className: containerClasses,
//       attributes: { src, draggable: "false" },
//     };
//   }
//   const previewImages = items.getPreviewImages(item);
//   if (previewImages.length === 0)
//     return {
//       className: containerClasses.concat([cls.folderImagesEmpty]),
//       children: "Empty",
//     };
//   return {
//     className: containerClasses.concat([cls.folderImages]),
//     children: previewImages.map((src) => ({
//       className: cls.folderImagesSubContanier,
//       children: {
//         type: "img",
//         attributes: { src },
//       },
//     })),
//   };
// };

// const viewSubtracksLoadingGrid = (): DivDefinition => ({
//   style: {
//     ...styles.flexCenter,
//     margin: "10px",
//   },
//   children: {
//     className: cls.loadGrid,

//     children: Array.from(new Array(9)).map(() => ({})),
//   },
// });
