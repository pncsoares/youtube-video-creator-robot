import 'dotenv/config'
import inputRobot from './Robots/InputRobot.js';
import textRobot from './Robots/TextRobot.js';
import { loadState } from './Robots/StateRobot.js';
import imageRobot from './Robots/ImageRobot.js';
import videoRobot from './Robots/VideoRobot.js';
import videoUploaderRobot from './Robots/VideoUploaderRobot.js';

async function start() {
    inputRobot();
    await textRobot();
    await imageRobot();
    await videoRobot();
    await videoUploaderRobot();

    const content = loadState();
    console.dir(content, { depth: null });
}

start();