# 📷 **Mia**, the image hunter

Mia uses Google Api to search for images and Image Downloader to download them.
In her algorithm, it was implemented a fallback system to allow the program to run even if some images couldn't be downloaded.

## Data Structure

```js
content: {
    downloadedImages: [""]
}
```

## External packages

### `import google from 'googleapis';`

Google's officially supported Node.js client library for accessing Google APIs. Support for authorization and authentication with OAuth 2.0, API Keys and JWT (Service Tokens) is included. 

[Documentation 📄](https://github.com/googleapis/google-api-nodejs-client#readme)

### `import imageDownloader from 'image-downloader';`

A Node module for downloading image to disk from a given URL.

[Documentation 📄](https://gitlab.com/demsking/image-downloader)