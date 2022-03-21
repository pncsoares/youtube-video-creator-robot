import got from 'got';
import sentenceBoundaryDetection from 'sbd';

export default async function robot(content) {
    await prepareSearchTermToRequestWikipedia(content);
    await fetchContentSummaryFromWikipedia(content);
    await fetchRelatedContentFromWikipedia(content);

    content.sourceSanitizedContent = [];
    
    sanitizeSummary(content);
    sanitizeRelatedContent(content);

    breakContentIntoSentences(content);

    async function prepareSearchTermToRequestWikipedia(content) {
        content.searchTerm = content.searchTerm.replace(' ', '_');
    }

    function getWikipediaApiUrl() {
        return 'https://en.wikipedia.org/api/rest_v1/page';
    }

    async function fetchContentSummaryFromWikipedia(content) {
        const wikipediaApiRequestUrl = `${getWikipediaApiUrl()}/summary/${content.searchTerm}`;
        console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);
        const wikipediaResponse = await got(wikipediaApiRequestUrl);
        content.sourceSummaryOriginal = JSON.parse(wikipediaResponse.body);
    }

    async function fetchRelatedContentFromWikipedia(content) {
        const wikipediaApiRequestUrl = `${getWikipediaApiUrl()}/related/${content.searchTerm}`;
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

    function breakContentIntoSentences(content) {
        content.sentences = [];

        const sentences = sentenceBoundaryDetection.sentences(content.sourceSanitizedContent.join());

        sentences.forEach(sentence => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            });
        });
    }
}