import { cls, DivDefinition, styles } from "../infra";
import * as style from "./style";
import * as items from "../items";

export const itemPreview = (item: Item): DivDefinition => {
  return {
    className: cls.cardPreviewContainer,
    style: {
      overflow: "hidden",
      paddingBottom: items.isOpenAtGallery(item)
        ? "0"
        : style.initialPaddingPercent,
      position: "relative",
    },
    children: getPreviewImage(item),
  };
};

export const getPreviewImage = (item: Item): DivDefinition => {
  if (!items.isFolder(item))
    return {
      type: "img",
      style: {
        //TODO: extract styles into classes
        ...styles.overlay,
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        //this makes animation better for non-channel items
        objectPosition: "top",
      },

      attributes: { src: items.getImageSrc(item), draggable: "false" },
    };
  else {
    return folderPreviewGrid(item);
  }
};

const folderPreviewGrid = (item: Folder): DivDefinition => {
  const previewImages = items.getPreviewImages(item, 4);
  if (previewImages.length == 0)
    return {
      style: {
        ...styles.flexCenter,
        ...styles.overlay,
        color: "gray",
        fontSize: "40px",
      },
      children: "Empty",
    };
  return {
    style: {
      display: "grid",
      gridTemplateColumns: "50% 50%",
      gridTemplateRows: "50% 50%",
      gridGap: "2px",
      ...styles.overlay,
    },
    children: items.getPreviewImages(item, 4).map((src) => ({
      type: "img",
      style: {
        width: "100%",
        height: "100%",
        display: "block",
        objectFit: "cover",
        objectPosition: "top",
      },
      attributes: { src, draggable: "false" },
    })),
  };
};
