import 'dotenv/config'
import readline from 'readline-sync';
import textRobot from './Robots/TextRobot.js';

async function start() {
    const content = {
        maxSentences: 7
    }

    // content.searchTerm = askSearchTerm();
    // content.prefix = askPrefix();

    // dummy to speed up development
    content.searchTerm = "Michael Jackson";
    content.prefix = "The history of";

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
}

start();