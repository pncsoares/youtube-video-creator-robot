import google from 'googleapis';
import { loadState, saveState } from './StateRobot.js';

const customSearch = google.google.customsearch('v1');

export default async function imageRobot() {
    const content = loadState();

    await fetchImagesToAllSentences(content);

    saveState(content);
}

async function fetchImagesToAllSentences(content) {
    for (const sentence of content.sentences) {
        if (sentence.keywords[0]) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;
            sentence.images = await fetchGoogleAndReturnImagesLinks(query);
            sentence.googleSearchQuery = query;
        }
    }
}

async function fetchGoogleAndReturnImagesLinks(query) {
    const googleResponse = await customSearch.cse.list({
        auth: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
        q: query,
        searchType: 'image',
        num: 2
    })

    const imagesUrl = googleResponse.data.items.map(item => {
        return item.link;
    });

    return imagesUrl;
}