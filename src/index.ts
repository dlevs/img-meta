#!/usr/bin/env NODE_OPTIONS=--no-warnings node

import path from "node:path";
import { stdout } from "node:process";

import { Command } from "commander";
import exifReader from "exif-reader";
import { globby } from "globby";
import zipObject from "lodash/zipObject.js";
import pLimit from "p-limit";
import sharp from "sharp";

import packageJson from "../package.json" assert { type: "json" };
import { getGoogleMapsURL } from "./lib/gpsUtils.js";
import { ImageMeta, ImageMetaGPS } from "./lib/types.js";

const program = new Command();

program
  .name("img-meta")
  .version(packageJson.version)
  .description(
    "Process a directory, outputting a single JSON file that describes all the images contained within."
  )
  .argument("<input-directory>", "Directory containing images to process")
  .option(
    "--ext",
    "Comma-separated list of file extensions to process",
    "jpg,jpeg,png,ico"
  )
  .action(processCommand);

program.parse();

async function processCommand(srcDir: string, args: { ext: string }) {
  // Get list of relevant files.
  const filepaths = await globby(path.join(srcDir, `**/*.{${args.ext}}`));

  // Get metadata for each file.
  const limit = pLimit(20);
  const metaArray = await Promise.all(
    filepaths.map((filepath) => limit(() => getImageMeta(filepath)))
  );
  const relativeFilepaths = filepaths.map(
    (filepath) => `/${path.relative(srcDir, filepath)}`
  );
  const meta = zipObject(relativeFilepaths, metaArray);

  // Print to stdout.
  stdout.write(JSON.stringify(meta, null, 2));
}

const getImageMeta = async (filepath: string): Promise<ImageMeta> => {
  const sharpFile = sharp(filepath);

  try {
    const metadata = await sharpFile.metadata();
    const exifData = metadata.exif && exifReader(metadata.exif);
    let { width, height } = metadata;

    if (width == null) {
      throw new Error(`Could not determine width of image ${filepath}`);
    }

    if (height == null) {
      throw new Error(`Could not determine height of image ${filepath}`);
    }

    // Account for image rotation.
    //
    // https://sirv.com/help/articles/rotate-photos-to-be-upright/
    //
    // 1 = 0 degrees: the correct orientation, no adjustment is required.
    // 2 = 0 degrees, mirrored: image has been flipped back-to-front.
    // 3 = 180 degrees: image is upside down.
    // 4 = 180 degrees, mirrored: image has been flipped back-to-front and is upside down.
    // 5 = 90 degrees: image has been flipped back-to-front and is on its side.
    // 6 = 90 degrees, mirrored: image is on its side.
    // 7 = 270 degrees: image has been flipped back-to-front and is on its far side.
    // 8 = 270 degrees, mirrored: image is on its far side.
    if (metadata.orientation && metadata.orientation >= 5) {
      [width, height] = [height, width];
    }

    return {
      width,
      height,
      date: (
        exifData?.exif?.DateTimeOriginal as Date | undefined
      )?.toISOString(),
      googleMapsURL: exifData?.gps
        ? getGoogleMapsURL({
            latitude: exifData.gps.GPSLatitude,
            latitudeRef: exifData.gps.GPSLatitudeRef,
            longitude: exifData.gps.GPSLongitude,
            longitudeRef: exifData.gps.GPSLongitudeRef,
          } as ImageMetaGPS)
        : undefined,
    };
  } catch (err) {
    // Log more info, as sharp's error messages are not specific.
    // e.g. "[Error: Input file is missing]" - WHICH FILE?!
    console.error("Unexpected error while processing image file", filepath);
    throw err;
  }
};
