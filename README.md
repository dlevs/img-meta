This is a CLI tool that generates a JSON file with metadata about images in a directory.

## Usage

```sh
npx img-meta process --ext jpg,png ./public > ./images.json
```

The output looks like this:

```json
{
  "/travel/france/paris/20180303_172645.jpg": {
    "width": 5312,
    "height": 2988,
    "googleMapsURL": "https://www.google.com/maps/search/?api=1&query=48.8644444,2.3247222"
  },
  "/travel/france/paris/20180303_173949.jpg": {
    "width": 5312,
    "height": 2988,
    "googleMapsURL": "https://www.google.com/maps/search/?api=1&query=48.8658333,2.3213889"
  }
}
```

This is useful for easily getting the width and height properties needed to prevent layout shift when images load via the `<img />` tag. Some solutions read this data directly from the image on the fly, but that's not practical when images are deployed to a CDN, not co-located on the server with the code.
