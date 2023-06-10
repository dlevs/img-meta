import { GPSCoordinates, ImageMetaGPS } from "./types.js";

/**
 * Creates a Google Maps URL from the raw GPS Exif data from a photo.
 */
export const getGoogleMapsURL = ({
  latitude,
  longitudeRef,
  longitude,
  latitudeRef,
}: ImageMetaGPS) => {
  const latitudeString = convertDMSToDD(latitude, latitudeRef);
  const longitudeString = convertDMSToDD(longitude, longitudeRef);

  return `https://www.google.com/maps/search/?api=1&query=${latitudeString},${longitudeString}`;
};

/**
 * Convert DMS (Degrees Minutes Seconds) to DD (Decimal Degrees).
 */
const convertDMSToDD = (
  [degrees, minutes, seconds]: GPSCoordinates,
  direction: "N" | "E" | "S" | "W"
) => {
  let dd = degrees + minutes / 60 + seconds / (60 * 60);

  if (direction == "S" || direction == "W") {
    dd *= -1;
  }

  return dd.toFixed(7);
};
