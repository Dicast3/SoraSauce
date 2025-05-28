function searchResults(html) {
    const results = [];
    const baseUrl = "https://eja.tv";

    const itemRegex = /<div class="channel-item">[\s\S]*?<a href="([^"]+)"[^>]*>[\s\S]*?<img src="([^"]+)"[^>]*>[\s\S]*?<div class="channel-title">([^<]+)<\/div>/g;
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
    const details = [];

    const descriptionMatch = html.match(/<div class="channel-description">([\s\S]*?)<\/div>/);
    let description = descriptionMatch ? descriptionMatch[1].trim() : '';

    const aliasesMatch = html.match(/<div class="channel-aliases">([\s\S]*?)<\/div>/);
    let aliases = aliasesMatch ? aliasesMatch[1].trim() : '';

    const airdateMatch = html.match(/<div class="channel-airdate">([\s\S]*?)<\/div>/);
    let airdate = airdateMatch ? airdateMatch[1].trim() : '';

    details.push({
        description: description,
        aliases: aliases,
        airdate: airdate
    });

    return details;
}

function extractEpisodes(html) {
    // Poiché i canali IPTV sono trasmissioni live, non ci sono episodi da estrarre.
    return [];
}

function extractStreamUrl(html) {
    const streamMatch = html.match(/<source[^>]+src="([^"]+\.m3u8)"[^>]*>/);
    return streamMatch ? streamMatch[1] : null;
}
