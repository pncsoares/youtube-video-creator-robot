import got from 'got';
import sentenceBoundaryDetection from 'sbd';
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';

const nlu = new NaturalLanguageUnderstandingV1({
    url: process.env.WATSON_URL,
    version: process.env.WATSON_API_VERSION,
    username: process.env.WATSON_USERNAME,
    password: process.env.WATSON_PASSWORD
});

export default async function robot(content) {
    await prepareSearchTermToRequestWikipedia(content);
    await fetchContentSummaryFromWikipedia(content);
    await fetchRelatedContentFromWikipedia(content);
    sanitizeSummary(content);
    sanitizeRelatedContent(content);
    breakContentIntoSentences(content);
    limitSentences(content);
    await fetchKeywordsOfAllSentences(content);
}

async function prepareSearchTermToRequestWikipedia(content) {
    content.searchTerm = content.searchTerm.replace(' ', '_');
}

function getWikipediaApiUrl() {
    return process.env.WIKIPEDIA_API_URL;
}

async function fetchContentSummaryFromWikipedia(content) {
    const wikipediaApiRequestUrl = `${getWikipediaApiUrl()}/page/summary/${content.searchTerm}`;
    console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);
    const wikipediaResponse = await got(wikipediaApiRequestUrl);
    content.sourceSummaryOriginal = JSON.parse(wikipediaResponse.body);
}

async function fetchRelatedContentFromWikipedia(content) {
    const wikipediaApiRequestUrl = `${getWikipediaApiUrl()}/page/related/${content.searchTerm}`;
    console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);
    const wikipediaResponse = await got(wikipediaApiRequestUrl);
    content.sourceRelatedContentOriginal = JSON.parse(wikipediaResponse.body);
}

function sanitizeSummary(content) {
    const description = returnExtractProperty(content.sourceSummaryOriginal);
    content.sourceSanitizedContent = [];
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

function limitSentences(content) {
    content.sentences = content.sentences.slice(0, content.maxSentences);
}

async function fetchKeywordsOfAllSentences(content) {
    for (const sentence of content.sentences) {
        sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);
    }
}

async function fetchWatsonAndReturnKeywords(sentence) {
    return new Promise((resolve, reject) => {
        nlu.analyze({
            text: sentence,
            features: {
                keywords: {}
            }
        },
        (error, response) => {
            if (error) {
                throw error;
            }

            const keywords = response.keywords.map(keyword => {
                return keyword.text;
            });

            resolve(keywords);
        });
    });
}