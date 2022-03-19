const readline = require('readline-sync');

function start() {
    const content = {}

    content.searchTerm = askSearchTerm();
    content.prefix = askPrefix();

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