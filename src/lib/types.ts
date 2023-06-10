export interface ImageMeta {
  width: number;
  height: number;
  googleMapsURL?: string;
}

export interface ImageMetaGPS {
  latitude: GPSCoordinates;
  latitudeRef: "N" | "S";
  longitude: GPSCoordinates;
  longitudeRef: "E" | "W";
}

export type GPSCoordinates = [number, number, number];
