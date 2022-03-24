import google from 'googleapis';
import imageDownloader from 'image-downloader';
import gm from 'gm';
import { loadState, saveState } from './StateRobot.js';

const customSearch = google.google.customsearch('v1');
const imageMagick = gm.subClass({ imageMagick: true });

const imagesPath = './Images';

export default async function imageRobot() {
    const content = loadState();

    await fetchImagesToAllSentences(content);
    await downloadAllImages(content);
    await convertAllImages(content);

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

async function downloadAllImages(content) {
    content.downloadedImages = [];

    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        const images = content.sentences[sentenceIndex].images;

        for (let imageIndex = 0; imageIndex < images.length; imageIndex++) {
            const imageUrl = images[imageIndex];

            try {
                if (content.downloadedImages.includes(imageUrl)) {
                    throw new Error('Image already downloaded!');
                }

                await downloadAndSave(imageUrl, `${sentenceIndex}-original.png`);
                content.downloadedImages.push(imageUrl);

                console.log(`> [${sentenceIndex}][${imageIndex}] Image downloaded successfully: ${imageUrl}`);
                break;
            }
            catch (error) {
                console.log(`> [${sentenceIndex}][${imageIndex}] Error downloading (${imageUrl}): ${error}`);
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

async function convertAllImages(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        await convertImage(sentenceIndex);
    }
}

async function convertImage(sentenceIndex) {
    return new Promise((resolve, reject) => {
        
        // if the google images api downloads a GIF, we will take only the first frame
        // we will use the .png[0] to do that
        const inputFile = `${imagesPath}/${sentenceIndex}-original.png[0]`;
        const outputFile = `${imagesPath}/${sentenceIndex}-converted.png`;

        const width = 1920;
        const height = 1080;

        gm().in(inputFile)
            .out('(')
            .out('-clone')
            .out('0')
            .out('-background', 'white')
            .out('-blur', '0x9')
            .out('-resize', `${width}x${height}^`)
            .out(')')
            .out('(')
            .out('-clone')
            .out('0')
            .out('-background', 'white')
            .out('-resize', `${width}x${height}`)
            .out(')')
            .out('-delete', '0')
            .out('-gravity', 'center')
            .out('-compose', 'over')
            .out('-composite')
            .out('-extent', `${width}x${height}`)
            .write(outputFile, (error) => {
                if (error) {
                    return reject(error);
                }

                console.log(`> [video-robot] Image converted: ${outputFile}`);
                resolve();
            });
    });
}