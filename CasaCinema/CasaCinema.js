function searchResults(html) {
    const results = [];
    const baseUrl = "https://casacinema.world";

    const itemRegex = /<div class="item">[\s\S]*?<a href="([^"]+)"[^>]*>[\s\S]*?<img src="([^"]+)"[^>]*>[\s\S]*?<h3>([^<]+)<\/h3>/g;
    let match;

    while ((match = itemRegex.exec(html)) !== null) {
        let href = match[1];
        let imageUrl = match[2];
        let title = match[3];

        if (!href.startsWith("http")) {
            href = baseUrl + href;
        }

        if (!imageUrl.startsWith("http")) {
            imageUrl = baseUrl + imageUrl;
        }

        results.push({
            title: title.trim(),
            image: imageUrl,
            href: href
        });
    }

    return results;
}

function extractDetails(html) {
    const descriptionMatch = html.match(/<div class="desc">([\s\S]*?)<\/div>/);
    const description = descriptionMatch ? descriptionMatch[1].trim() : '';

    const aliasesMatch = html.match(/<h2 class="title" data-jtitle="([^"]+)">/);
    const aliases = aliasesMatch ? aliasesMatch[1].trim() : '';

    const airdateMatch = html.match(/<dt>Data di Uscita:<\/dt>\s*<dd>([^<]+)<\/dd>/);
    const airdate = airdateMatch ? airdateMatch[1].trim() : '';

    return [{
        description: description,
        aliases: aliases,
        airdate: airdate
    }];
}

function extractEpisodes(html) {
    const episodes = [];
    const baseUrl = "https://casacinema.world";

    const episodeRegex = /<li class="episode">\s*<a[^>]+href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;

    while ((match = episodeRegex.exec(html)) !== null) {
        let href = match[1];
        const number = match[2].trim();

        if (!href.startsWith("http")) {
            href = baseUrl + href;
        }

        episodes.push({
            href: href,
            number: number
        });
    }

    return episodes;
}

function extractStreamUrl(html) {
    const streamRegex = /<iframe[^>]+src="([^"]+)"[^>]*>/;
    const match = html.match(streamRegex);

    return match ? match[1] : null;
}
