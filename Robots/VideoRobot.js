import gm from 'gm';
import spawn from 'child_process/spawn';
import path from 'path';
import { loadState, saveScript, saveState } from './StateRobot.js';

const imageMagick = gm.subClass({ imageMagick: true });
const rootPath = path.resolve(__dirname, '..');

const imagesPath = './Images';

export default async function videoRobot() {
    console.info('> [🤖 video-robot] Starting...');

    const content = loadState();

    await convertAllImages(content);
    await createAllImagesSentences(content);
    await createVideoThumbnail();
    await createAfterEffectsScript(content);
    await renderVideoWithAfterEffects();

    saveState(content);
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

        imageMagick()
            .in(inputFile)
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

                console.log(`> [🤖 video-robot] Image converted: ${outputFile}`);
                resolve();
            });
    });
}

async function createAllImagesSentences(content) {
    for (let sentenceIndex = 0; sentenceIndex < content.sentences.length; sentenceIndex++) {
        await createImageSentence(sentenceIndex, content.sentences[sentenceIndex].text);
    }
}

async function createImageSentence(sentenceIndex, sentenceText) {
    return new Promise((resolve, reject) => {
        const outputFile = `${imagesPath}/${sentenceIndex}-sentence.png`;

        const templateSettings = {
            0: {
                size: '1920x400',
                gravity: 'center'
            },
            1: {
                size: '1920x1080',
                gravity: 'center'
            },
            2: {
                size: '800x1080',
                gravity: 'west'
            },
            3: {
                size: '1920x400',
                gravity: 'center'
            },
            4: {
                size: '1920x1080',
                gravity: 'center'
            },
            5: {
                size: '800x1080',
                gravity: 'west'
            },
            6: {
                size: '1920x400',
                gravity: 'center'
            }
        }

        imageMagick()
            .out('-size', templateSettings[sentenceIndex].size)
            .out('-gravity', templateSettings[sentenceIndex].gravity)
            .out('-background', 'transparent')
            .out('-fill', 'white')
            .out('-kerning', '-1')
            .out(`caption:${sentenceText}`)
            .write(outputFile, (error) => {
                if (error) {
                    return reject(error);
                }

                console.log(`> [🤖 video-robot] Sentence created: ${outputFile}`);
                resolve();
            })
    });
}

async function createVideoThumbnail() {
    return new Promise((resolve, reject) => {
        imageMagick()
            .in(`${imagesPath}/0-converted.png`)
            .write(`${imagesPath}/youtube-thumbnail.jpg`, error => {
                if (error) {
                    return reject(error);
                }

                console.log('> [🤖 video-robot] Video thumbnail created successfully');
                resolve();
            });
    });
}

async function createAfterEffectsScript(content) {
    saveScript(content);
}

async function renderVideoWithAfterEffects() {
    return new Promise((resolve, reject) => {
        
        // this paths will be improved in future commits
        const aeRenderFilePath = '/Applications/Adobe After Effects CC 2019/aerender';
        const templateFilePath = `${rootPath}/templates/1/template.aep`;
        
        const targetFilePath = `${rootPath}/Videos/output.mov`;

        console.log('> [🤖 video-robot] Starting After Effects');

        const aeRender = spawn(aeRenderFilePath, [
            '-comp', 'main',
            '-project', templateFilePath,
            '-output', targetFilePath
        ]);

        aeRender.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        aeRender.on('close', () => {
            console.log('> [🤖 video-robot] After Effects closed');
            resolve();
        });
    });
}