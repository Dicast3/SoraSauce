const baseUrl = "https://toonitalia.xyz/wp-json/";
const searchBaseUrl = "https://toonitalia.xyz/wp-json/wp/v2/posts?search=%s"; // Search URL
const streamType = "HLS"; // Streaming format
const quality = "720p"; // Stream quality

// Function to search for anime based on a title query
function searchResults(html) {
    const results = [];
    const jsonResponseRegex = /<script[^>]*id="json-response"[^>]*>(.*?)<\/script>/;
    const jsonResponseMatch = html.match(jsonResponseRegex);

    if (!jsonResponseMatch) {
        console.log("No JSON data found in the HTML.");
        return results;
    }

    const jsonData = JSON.parse(jsonResponseMatch[1]);

    jsonData.forEach(post => {
        if (!post || typeof post !== 'object') return;

        const imageUrl = post.acf?.image_url || '';
        const title = post.title.rendered || '';
        const id = post.id || '';
        const slug = post.slug || '';

        if (id && slug) {
            const href = `https://toonitalia.xyz/anime/${slug}-${id}`;

            results.push({
                title: title.trim(),
                image: imageUrl,
                href: href
            });
        }
    });

    return results;
}

// Function to extract anime details (description, aliases, airdate)
function extractDetails(html) {
    const details = [];
    
    const jsonResponseRegex = /<script[^>]*id="json-response"[^>]*>(.*?)<\/script>/;
    const jsonResponseMatch = html.match(jsonResponseRegex);

    if (!jsonResponseMatch) {
        console.log("No JSON data found for details.");
        return details;
    }

    const jsonData = JSON.parse(jsonResponseMatch[1]);
    const animeData = jsonData[0]; // Assume the first post is the anime

    const description = animeData.acf?.description || '';
    const aliases = animeData.title.rendered || '';
    const airdate = animeData.date || ''; // Assuming airdate is available in the 'date' field

    if (description && aliases && airdate) {
        details.push({
            description: description,
            aliases: aliases,
            airdate: airdate
        });
    }

    return details;
}

// Function to extract episodes data
function extractEpisodes(html) {
    const episodes = [];

    const jsonResponseRegex = /<script[^>]*id="json-response"[^>]*>(.*?)<\/script>/;
    const jsonResponseMatch = html.match(jsonResponseRegex);

    if (!jsonResponseMatch) {
        console.log("No JSON data found for episodes.");
        return episodes;
    }

    const jsonData = JSON.parse(jsonResponseMatch[1]);
    const animeData = jsonData[0]; // Assume the first post is the anime

    const episodesData = animeData.acf?.episodes || [];

    episodesData.forEach(episode => {
        episodes.push({
            href: `https://toonitalia.xyz/anime/${animeData.slug}-${animeData.id}/episode-${episode.id}`,
            number: episode.number
        });
    });

    return episodes;
}

// Function to extract the stream URL (HLS)
async function extractStreamUrl(html) {
    try {
        const videoPlayerRegex = /<video-player[^>]*url="([^"]*)"/;
        const videoPlayerMatch = html.match(videoPlayerRegex);

        if (!videoPlayerMatch) {
            console.log('No HLS stream URL found in the HTML.');
            return null;
        }

        const streamUrl = videoPlayerMatch[1];

        // If stream type is HLS, ensure the correct format is used
        if (streamType === "HLS" && streamUrl) {
            console.log('HLS stream URL:', streamUrl);
            return streamUrl;
        }

        console.log('No valid stream URL found.');
        return null;
    } catch (error) {
        console.log('Error extracting stream URL:', error);
        return null;
    }
}

// Example: Function to search for an anime title
async function searchAnime(query) {
    const searchUrl = searchBaseUrl.replace('%s', encodeURIComponent(query));
    const response = await fetch(searchUrl);
    const data = await response.json();

    const results = data.map(post => {
        return {
            title: post.title.rendered,
            image: post.acf?.image_url,
            href: `https://toonitalia.xyz/anime/${post.slug}-${post.id}`
        };
    });

    return results;
}
