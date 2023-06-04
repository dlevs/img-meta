#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

import { Command } from "commander";
import exifReader from "exif-reader";
import { globby } from "globby";
import zipObject from "lodash/zipObject.js";
import pLimit from "p-limit";
import sharp from "sharp";

import packageJson from "../package.json";

const program = new Command();

program
  .name("image-ninja")
  .description("CLI to some JavaScript string utilities")
  .version(packageJson.version);

program
  .command("split")
  .description("Split a string into substrings and display as an array")
  .argument("<string>", "string to split")
  .option("--first", "display just the first substring")
  .option("-s, --separator <char>", "separator character", ",")
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();

main();

async function main() {
  const srcDir = process.argv[2];

  if (!srcDir) {
    throw new Error("No source directory provided");
  }

  const filepaths = await globby(path.join(srcDir, "**/*.{jpg,jpeg,png}"));
  console.log(`Storing metadata for ${filepaths.length} files.`);

  const limit = pLimit(20);
  const metaArray = await Promise.all(
    filepaths.map((filepath) => limit(() => getImageMeta(filepath)))
  );
  const relativeFilepaths = filepaths.map(
    (filepath) => `/${path.relative(srcDir, filepath)}`
  );
  const meta = zipObject(relativeFilepaths, metaArray);
  await writeImagesFiles(meta);
}

async function writeImagesFiles(images: Record<string, ImageMeta>) {
  const outDir = new URL("../node_modules/.image-ninja/", import.meta.url);
  const typesString = await fs.readFile(
    new URL("types.d.ts", import.meta.url),
    "utf8"
  );
  const stringifiedSrc = Object.keys(images).map((filepath) => {
    return JSON.stringify(filepath);
  });

  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(
    new URL("images.js", outDir),
    `export const images=${JSON.stringify(images)}`
  );
  // Write types. It might be that we can just save 1 .json file instead of
  // .js and .d.ts, but I imagine this way is far more efficient.
  await fs.writeFile(
    new URL("images.d.ts", outDir),
    [
      typesString,
      `type ImageNinjaProcessedSrc = ${stringifiedSrc.join(" | ")}`,
      `export const images: Record<ImageNinjaProcessedSrc, ImageMeta>`,
    ].join("\n\n")
  );
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
      gps: exifData?.gps
        ? ({
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
