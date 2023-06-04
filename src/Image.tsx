import { forwardRef, ImgHTMLAttributes } from "react";

import {
  ImageNinjaProcessedSrc,
  // images,
} from "../node_modules/.image-ninja/images.js";

let images = {};

import("../node_modules/.image-ninja/images.js")
  .then((module) => {
    images = module.images;
  })
  .catch(() => {
    console.error("No image metadata was found. Run `image-ninja update`.");
  });

interface ImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: ImageNinjaProcessedSrc;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(function Image(
  props,
  ref
) {
  const image = images[props.src];
  let autoProps: ImageProps = {
    src: props.src,
  };

  if (image) {
    autoProps.width = image.width;
    autoProps.height = image.height;
  } else {
    console.error(
      `No metadata was found for image src ${props.src}, so the "width" and "height" attributes were not automatically set. If the image exists, generate the metadata by running \`image-ninja update\`.`
    );
  }

  return <img ref={ref} {...autoProps} {...props} />;
});
