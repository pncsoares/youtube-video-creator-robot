import fs from 'fs';

const contentFilePath = './Data/content.json';

export function saveState(content) {
    const contentString = JSON.stringify(content);
    return fs.writeFileSync(contentFilePath, contentString);
}

export function loadState() {
    const fileBuffer = fs.readFileSync(contentFilePath, 'utf-8');
    return JSON.parse(fileBuffer);
}