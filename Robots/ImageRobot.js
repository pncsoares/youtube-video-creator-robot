import google from 'googleapis';
import imageDownloader from 'image-downloader';
import { loadState, saveState } from './StateRobot.js';

const customSearch = google.google.customsearch('v1');

const imagesPath = './Images';

export default async function imageRobot() {
    console.info('> [🤖 image-robot] Starting...');

    const content = loadState();

    await fetchImagesToAllSentences(content);
    await downloadAllImages(content);

    saveState(content);
}

async function fetchImagesToAllSentences(content) {
    for (const sentence of content.sentences) {
        if (sentence.keywords[0]) {
            const query = `${content.searchTerm} ${sentence.keywords[0]}`;

            console.info(`> [🤖 image-robot] Querying Google Images with: "${query}"`);

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

async function downloadAllImages(content) {
    content.downloadedImages = [];

    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        const images = content.sentences[sentenceIndex].images;

        for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
            const imageUrl = images[imageIndex];

            try {
                if (content.downloadedImages.includes(imageUrl)) {
                    throw new Error('> [🤖 image-robot] Image already downloaded!');
                }

                await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
                content.downloadedImages.push(imageUrl);

                console.log(`> [🤖 image-robot] [${sentenceIndex}][${imageIndex}] Image downloaded successfully: ${imageUrl}`);
                break;
            }
            catch (error) {
                console.log(`> [🤖 image-robot] [${sentenceIndex}][${imageIndex}] Error downloading (${imageUrl}): ${error}`);
            }
        }
    }
}

async function downloadAndSave(url, filename) {
    return imageDownloader.image({
        url: url,
        dest: `${imagesPath}/${filename}`
    });
}