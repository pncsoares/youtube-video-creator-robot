# 📰 **Alex**, the text hunter

Alex retrieves information related to a topic using Wikipedia API (wikimedia), sanitize the text, breaks all the text in sentences using the node library `sbd` and then works together with Watson from IBM (IA) to fetch some keywords related to that sentences.

## Data Structure

```js
content: {
    searchTerm: "",
    prefix: "",
    sourceSummaryOriginal: "",
    sourceRelatedContentOriginal: "",
    sourceSanitizedContent: [""],
    sentences: [
        {
            text: "",
            keywords: [""],
            images: [""]
        }
    ]
}
```

## External packages

### `import got from 'got';`

Human-friendly and powerful HTTP request library for Node.js

[Documentation 📄](https://github.com/sindresorhus/got#readme)

### `import sentenceBoundaryDetection from 'sbd';`

Sentence Boundary Detection in javascript for node. 

[Documentation 📄](https://github.com/Tessmore/sbd)

### `import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';`

Node.js library to access IBM Watson services.

[Documentation 📄](https://github.com/watson-developer-cloud/node-sdk#readme)