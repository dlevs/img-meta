This is a CLI tool that generates a JSON file with metadata about images in a directory.

## Usage

```sh
npx img-meta ./public > ./images.json
```

The output looks like this:

```json
{
  "/travel/france/paris/20180303_172645.jpg": {
    "width": 5312,
    "height": 2988,
    "date": "2017-06-10T13:52:40.000Z",
    "googleMapsURL": "https://www.google.com/maps/search/?api=1&query=48.8644444,2.3247222"
  },
  "/travel/france/paris/20180303_173949.jpg": {
    "width": 5312,
    "height": 2988,
    "date": "2017-06-08T15:12:31.000Z",
    "googleMapsURL": "https://www.google.com/maps/search/?api=1&query=48.8658333,2.3213889"
  }
}
```

This is useful for easily getting the width and height properties needed to prevent layout shift when images load via the `<img />` tag. Some solutions read this data directly from the image on the fly, but that's not practical when images are deployed to a CDN, not co-located on the server with the code.

## TypeScript

TypeScript output is also supported:

```sh
npx img-meta --format typescript ./public > ./images.ts
```

This leads to more efficient type-checking when you have many, many images, which can cause IDE lag when using the JSON format.
