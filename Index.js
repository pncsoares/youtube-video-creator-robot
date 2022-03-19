const readline = require('readline-sync');

function start() {
    const content = {}

    content.searchTerm = askSearchTerm();

    function askSearchTerm() {
        return readline.question('Type a search term: ');
    }

    console.log(content);
}

start();