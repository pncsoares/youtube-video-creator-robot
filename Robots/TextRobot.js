import got from 'got';
import sentenceBoundaryDetection from 'sbd';
import NaturalLanguageUnderstandingV1 from 'watson-developer-cloud/natural-language-understanding/v1.js';
import { saveState, loadState } from './StateRobot.js';

// My account is not activated yet - I am facing an issue and I already reported it to the IBM support team.
// const nlu = new NaturalLanguageUnderstandingV1({
//     url: process.env.WATSON_URL,
//     version: process.env.WATSON_API_VERSION,
//     username: process.env.WATSON_USERNAME,
//     password: process.env.WATSON_PASSWORD
// });

export default async function textRobot() {
    console.info('> [🤖 text-robot] Starting...');

    const content = loadState();

    replaceSearchTermSpacesWithUnderscores(content);
    await fetchContentSummaryFromWikipedia(content);
    await fetchRelatedContentFromWikipedia(content);
    replaceSearchTermUnderscoresWithSpaces(content);
    sanitizeSummary(content);
    sanitizeRelatedContent(content);
    breakContentIntoSentences(content);
    limitSentences(content);
    // await fetchKeywordsOfAllSentences(content);

    saveState(content);
}

async function replaceSearchTermSpacesWithUnderscores(content) {
    content.searchTerm = content.searchTerm.replace(' ', '_');
}

async function replaceSearchTermUnderscoresWithSpaces(content) {
    content.searchTerm = content.searchTerm.replace('_', ' ');
}

function getWikipediaApiUrl() {
    return process.env.WIKIPEDIA_API_URL;
}

async function fetchContentSummaryFromWikipedia(content) {
    console.info('> [🤖 text-robot] Fetching content summary from Wikipedia');

    const wikipediaApiUrl = getWikipediaApiUrl();
    const wikipediaApiRequestUrl = `${wikipediaApiUrl}/page/summary/${content.searchTerm}`;
    const wikipediaResponse = await got(wikipediaApiRequestUrl);
    content.sourceSummaryOriginal = JSON.parse(wikipediaResponse.body);
}

async function fetchRelatedContentFromWikipedia(content) {
    console.info('> [🤖 text-robot] Fetching related content from Wikipedia');

    const wikipediaApiUrl = getWikipediaApiUrl();
    const wikipediaApiRequestUrl = `${wikipediaApiUrl}/page/related/${content.searchTerm}`;
    const wikipediaResponse = await got(wikipediaApiRequestUrl);
    content.sourceRelatedContentOriginal = JSON.parse(wikipediaResponse.body);

    console.info('> [🤖 text-robot] All content fetched successfully');
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
    console.info('> [🤖 text-robot] Starting to fetch keyword from Watson...');

    for (const sentence of content.sentences) {
        console.info(`> [🤖 text-robot] Sentence: "${sentence.text}"`);

        sentence.keywords = await fetchWatsonAndReturnKeywords(sentence.text);

        console.info(`> [🤖 text-robot] Keywords: ${sentence.keywords.join(', ')}`);
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
                reject(error);
                return;
            }

            const keywords = response.keywords.map(keyword => {
                return keyword.text;
            });

            resolve(keywords);
        });
    });
}