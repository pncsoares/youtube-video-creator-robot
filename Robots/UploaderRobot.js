import { loadState, saveScript, saveState } from './StateRobot.js';

export default async function uploaderRobot() {
    const content = loadState();

    // do stuff

    saveState(content);
}