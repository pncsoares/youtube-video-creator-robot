import 'dotenv/config'
import inputRobot from './Robots/InputRobot.js';
import textRobot from './Robots/TextRobot.js';
import { loadState } from './Robots/StateRobot.js';

async function start() {
    inputRobot();
    await textRobot();

    const content = loadState();
    console.dir(content, { depth: null });
}

start();