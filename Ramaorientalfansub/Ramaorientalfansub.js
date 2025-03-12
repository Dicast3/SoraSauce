function searchResults(html) {
    const results = [];
    // Split by the unique item container start.
    const itemBlocks = html.split('<div class="w-full bg-gradient-to-t from-primary to-transparent rounded overflow-hidden shadow shadow-primary">');
    
    // Remove the first element as it contains content before the first item.
    itemBlocks.shift();

    itemBlocks.forEach(block => {
        // Extract the href from the <h3> tag's <a> element.
        const hrefMatch = block.match(/<h3>[\s\S]*?<a href="([^"]+)"/);
        // Extract the title from the same <a> element.
        const titleMatch = block.match(/<h3>[\s\S]*?<a [^>]+>([\s\S]*?)<\/a>/);
        // Extract the image URL from the first <img> tag, making it more flexible
        const imgMatch = block.match(/<img[^>]+data-src=['"]([^'"]+)['"]/);

        if (hrefMatch && titleMatch && imgMatch) {
            const href = hrefMatch[1].trim();
            const title = decodeHTMLEntities(titleMatch[1].trim());
            const image = imgMatch[1].trim();
            
            results.push({ title, image, href });
        }
    });

    console.log(results);
    return results;
}


function extractDetails(html) {
    const details = [];

    const descriptionMatch = html.match(/<span class="block w-full max-h-24 overflow-scroll mlb-3 overflow-x-hidden text-xs text-gray-200">([^<]+)<\/span>/);
    let description = descriptionMatch 
        ? decodeHTMLEntities(descriptionMatch[1].trim())
        : 'N/A';

    const aliasMatch = html.match(/<li>\s*<span>\s*(\d+M)\s*<\/span>/);
    let alias = aliasMatch ? aliasMatch[1].trim() : 'N/A';

    let airdate = 'N/A';

    details.push({
        description: description,
        alias: alias,
        airdate: airdate
    });

    console.log(details);
    return details;
}

function extractEpisodes(html) {
    const episodes = [];

    const slideRegex = /<div class="swiper-slide[^"]*"[\s\S]*?<a href="([^"]+)"[^>]*title="([^"]+)"/g;
    let match;
    
    while ((match = slideRegex.exec(html)) !== null) {
        const href = match[1].trim();
        const title = match[2].trim();

        const epNumMatch = title.match(/episodio\s*(\d+)/i);
        
        if (epNumMatch) {
            episodes.push({
                href: href,
                number: epNumMatch[1].trim()
            });
        }
    }

    if (episodes[0].number !== "1") {
        episodes.reverse();
    }

    console.log(episodes);
    return episodes;
}


function extractStreamUrl(html) {
    const streamMatch = html.match(/<iframe[^>]+src=['"]([^'"]+)['"]/);
    const stream = streamMatch ? streamMatch[1].trim() : 'N/A';

    console.log(stream);
    return stream;
}

function decodeHTMLEntities(text) {
    text = text.replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec));
    
    const entities = {
        '&quot;': '"',
        '&amp;': '&',
        '&apos;': "'",
        '&lt;': '<',
        '&gt;': '>'
    };
    
    for (const entity in entities) {
        text = text.replace(new RegExp(entity, 'g'), entities[entity]);
    }

    return text;
}
