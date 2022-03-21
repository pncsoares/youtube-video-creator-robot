import got from 'got';

export default async function robot(content) {
    await prepareSearchTermToRequestWikipedia(content);
    await fetchContentSummaryFromWikipedia(content);
    await fetchRelatedContentFromWikipedia(content);
    content.sourceSanitizedContent = [];
    sanitizeSummary(content);
    sanitizeRelatedContent(content);

    async function prepareSearchTermToRequestWikipedia(content) {
        content.searchTerm = content.searchTerm.replace(' ', '_');
    }

    async function fetchContentSummaryFromWikipedia(content) {
        const wikipediaApiRequestUrl = `${process.env.WIKIPEDIA_API_URL}/summary/${content.searchTerm}`;
        console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);
        const wikipediaResponse = await got(wikipediaApiRequestUrl);
        content.sourceSummaryOriginal = JSON.parse(wikipediaResponse.body);
    }

    async function fetchRelatedContentFromWikipedia(content) {
        const wikipediaApiRequestUrl = `${process.env.WIKIPEDIA_API_URL}/related/${content.searchTerm}`;
        console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);
        const wikipediaResponse = await got(wikipediaApiRequestUrl);
        content.sourceRelatedContentOriginal = JSON.parse(wikipediaResponse.body);
    }

    function sanitizeSummary(content) {
        const description = returnExtractProperty(content.sourceSummaryOriginal);
        content.sourceSanitizedContent.push(description);
    }

    function sanitizeRelatedContent(content) {
        content.sourceRelatedContentOriginal.pages.forEach(page => {
            const description = returnExtractProperty(page);
            content.sourceSanitizedContent.push(description);
        });
    }

    function returnExtractProperty(rawJson) {
        return rawJson.extract;
    }
}