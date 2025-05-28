function searchResults(html) {
    const results = [];
    const baseUrl = "https://eja.tv";

    const cardRegex = /<a href="([^"]+)"[^>]*>([^<]+)<\/a>/g;
    let match;

    while ((match = cardRegex.exec(html)) !== null) {
        let href = match[1];
        let title = match[2];
        let imageUrl = "https://eja.tv/static/default-thumbnail.png"; // Nessuna immagine specifica per i canali

        if (!href.startsWith("http")) {
            href = baseUrl + "/play/?" + href;
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
    return [{
        description: "Live TV Channel",
        aliases: "N/A",
        airdate: "N/A"
    }];
}

function extractStreamUrl(html) {
    const streamRegex = /<iframe[^>]+src="([^"]+\.m3u8[^"]*)"/;
    const match = html.match(streamRegex);

    if (match) {
        return match[1];
    }

    const altRegex = /play\/\?([^"]+)/;
    const altMatch = html.match(altRegex);
    if (altMatch) {
        return "https://eja.tv/play/?" + altMatch[1];
    }

    return null;
}

function extractEpisodes(html) {
    const episodes = [];
    const streamUrl = extractStreamUrl(html);

    if (streamUrl) {
        episodes.push({
            href: streamUrl,
            number: "Live"
        });
    }

    return episodes;
}
