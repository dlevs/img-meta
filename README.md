TODO: Write this bit

## Usage

```tsx
import { Image } from "image-ninja";

function App() {
  return <Image src="/animals/dog.jpg" alt="My friendly dog" />;
}
```

This renders as an `<img>` tag, with the following extra features:

1. The `width` attribute is automatically set.
2. The `height` attribute is automatically set.
3. The `src` attribute is type-checked, catching typos and images that have not yet had their dimensions read.
4. The `src` attribute is automatically prefixed with a CDN URL, if one is configured.

## CLI

```sh
npx image-ninja update --ext jpg,png ./public
```

## Why

TODO: Flesh this out

- Not runtime, as images not always co-located with code
- Width / height prevent layout shift

## Additional features

```ts
import { setImageBaseURL } from "image-ninja";

setImageBaseURL("https://example-cdn.com/my-account");
```

```ts
import { getImageMeta } from "image-ninja";

const meta = getImageMeta("/animals/dog.jpg");

console.log(meta.gps);
```
