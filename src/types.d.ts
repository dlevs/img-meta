interface ImageMeta {
  width: number;
  height: number;
  gps?: ImageMetaGPS;
}

interface ImageMetaGPS {
  latitude: GPSCoordinates;
  latitudeRef: "N" | "S";
  longitude: GPSCoordinates;
  longitudeRef: "E" | "W";
}

type GPSCoordinates = [number, number, number];
