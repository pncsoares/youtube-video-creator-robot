import got from 'got';

export default async function robot(content) {
    prepareSearchTermToRequestWikipedia(content);
    fetchContentFromWikipedia(content);

    function prepareSearchTermToRequestWikipedia(content) {
        content.searchTerm = content.searchTerm.replace(' ', '_');
    }

    async function fetchContentFromWikipedia(content) {
        const wikipediaApiRequestUrl = `${process.env.WIKIPEDIA_API_URL}/${content.searchTerm}`;
        console.log('wikipediaApiRequestUrl', wikipediaApiRequestUrl);

        const wikipediaResponse = await got(wikipediaApiRequestUrl);

        const wikipediaContent = wikipediaResponse.body;
        console.log(wikipediaContent);
    }
}