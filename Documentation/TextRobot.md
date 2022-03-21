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