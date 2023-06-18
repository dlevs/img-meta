// !START OF TYPES THAT ARE PASTED VERBATIM INTO THE GENERATED TYPESCRIPT!
export interface ImageMeta {
  width: number;
  height: number;
  date?: string;
  googleMapsURL?: string;
}
// !END OF TYPES THAT ARE PASTED VERBATIM INTO THE GENERATED TYPESCRIPT!

export interface ImageMetaGPS {
  latitude: GPSCoordinates;
  latitudeRef: "N" | "S";
  longitude: GPSCoordinates;
  longitudeRef: "E" | "W";
}

export type GPSCoordinates = [number, number, number];
