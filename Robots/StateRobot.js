import fs from 'fs';

const contentFilePath = './Data/content.json';
const scriptFilePath = './Scripts/AfterEffectsScript.js'

export function saveState(content) {
    const contentString = JSON.stringify(content);
    return fs.writeFileSync(contentFilePath, contentString);
}

export function saveScript(content) {
    const contentString = JSON.stringify(content);
    const scriptString = `const content = ${contentString}`;
    return fs.writeFileSync(scriptFilePath, scriptString);
}

export function loadState() {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    return JSON.parse(fileBuffer);
}