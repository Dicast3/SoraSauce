function searchResults(html) {
    const results = [];
    
    // Supponiamo che i post siano contenuti in div con la classe '.post'
    const postRegex = /<div class="post">(.*?)<\/div>/g;
    let match;

    while (match = postRegex.exec(html)) {
        const postHtml = match[1];

        // Estrai il titolo (presumendo che ci sia un <h2 class="title">)
        const titleMatch = postHtml.match(/<h2 class="title">(.*?)<\/h2>/);
        const title = titleMatch ? titleMatch[1].trim() : '';

        // Estrai il link (presumendo che ci sia un <a href="...">)
        const hrefMatch = postHtml.match(/<a href="(.*?)"/);
        const href = hrefMatch ? hrefMatch[1] : '';

        if (title && href) {
            results.push({
                title: title,
                href: href
            });
        }
    }

    return results;
}
function extractDetails(html) {
    const details = [];

    // Estrai la descrizione
    const descriptionMatch = html.match(/<div class="description">(.*?)<\/div>/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    // Estrai gli alias (se presenti, ad esempio con una classe .aliases)
    const aliasesMatch = html.match(/<div class="aliases">(.*?)<\/div>/);
    const aliases = aliasesMatch ? aliasesMatch[1].trim() : '';

    // Estrai la data di uscita
    const airdateMatch = html.match(/<div class="airdate">(.*?)<\/div>/);
    const airdate = airdateMatch ? airdateMatch[1].trim() : '';

    if (description && aliases && airdate) {
        details.push({
            description: description,
            aliases: aliases,
            airdate: airdate
        });
    }

    return details;
}
function extractEpisodes(html) {
    const episodes = [];

    // Supponiamo che gli episodi siano in un elenco con la classe '.episodes'
    const episodesRegex = /<li class="episode">(.*?)<\/li>/g;
    let match;

    while (match = episodesRegex.exec(html)) {
        const episodeHtml = match[1];

        // Estrai il numero dell'episodio (presumendo ci sia un <span class="episode-number">)
        const numberMatch = episodeHtml.match(/<span class="episode-number">(.*?)<\/span>/);
        const number = numberMatch ? numberMatch[1].trim() : '';

        // Estrai il link dell'episodio (presumendo ci sia un <a href="...">)
        const hrefMatch = episodeHtml.match(/<a href="(.*?)"/);
        const href = hrefMatch ? hrefMatch[1] : '';

        if (number && href) {
            episodes.push({
                number: number,
                href: href
            });
        }
    }

    return episodes;
}
async function extractStreamUrl(html) {
    try {
        // Supponiamo che l'URL di streaming si trovi all'interno di un tag <script> o simile
        const streamUrlMatch = html.match(/"stream_url":"(https:\/\/[^"]+)"/);

        if (!streamUrlMatch) {
            console.log('Nessun URL di streaming trovato.');
            return null;
        }

        const streamUrl = streamUrlMatch[1];
        console.log('URL di streaming:', streamUrl);
        return streamUrl;
    } catch (error) {
        console.error('Errore durante il recupero dello stream URL:', error);
        return null;
    }
}
