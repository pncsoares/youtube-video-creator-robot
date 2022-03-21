import 'dotenv/config'
import readline from 'readline-sync';
import textRobot from './Robots/TextRobot.js';

async function start() {
    const content = {}

    content.searchTerm = askSearchTerm();
    content.prefix = askPrefix();

    await textRobot(content);

    function askSearchTerm() {
        return readline.question('Type a search term: ');
    }

    function askPrefix() {
        const prefixes = [
            'Who is',
            'What is',
            'The history of'
        ];

        const selectedPrefixIndex = readline.keyInSelect(prefixes);
        const selectedPrefixText = prefixes[selectedPrefixIndex];

        return selectedPrefixText;
    }

    console.log(content);
}

start();