import { expect, test } from "vitest";

import { getGoogleMapsURL } from "./gpsUtils.js";
import { ImageMetaGPS } from "./types.js";

test("getGoogleMapsURL()", () => {
  const coords: ImageMetaGPS = {
    latitude: [50, 5, 12.63],
    latitudeRef: "N",
    longitude: [14, 25, 15.12],
    longitudeRef: "E",
  };

  expect(getGoogleMapsURL(coords)).toBe(
    "https://www.google.com/maps/search/?api=1&query=50.0868417,14.4208667"
  );

  // Negative result from "S" / "W" references
  expect(
    getGoogleMapsURL({
      ...coords,
      latitudeRef: "S",
      longitudeRef: "W",
    })
  ).toBe(
    "https://www.google.com/maps/search/?api=1&query=-50.0868417,-14.4208667"
  );
});
