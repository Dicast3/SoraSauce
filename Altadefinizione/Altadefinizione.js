async function searchResults(keyword) {
  const response = await fetchv2(`https://altadefinizione.gent/?s=${encodeURIComponent(keyword)}`);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const items = doc.querySelectorAll('.item');

  const results = Array.from(items).map(item => {
    const titleElement = item.querySelector('.title');
    const imageElement = item.querySelector('img');
    const linkElement = item.querySelector('a');

    return {
      title: titleElement ? titleElement.textContent.trim() : null,
      image: imageElement ? imageElement.src : null,
      href: linkElement ? linkElement.href : null,
    };
  });

  return JSON.stringify(results);
}

async function extractDetails(url) {
  const response = await fetchv2(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const descriptionElement = doc.querySelector('.description');
  const airdateElement = doc.querySelector('.airdate');

  return JSON.stringify([
    {
      description: descriptionElement ? descriptionElement.textContent.trim() : 'N/A',
      aliases: 'N/A',
      airdate: airdateElement ? airdateElement.textContent.trim() : 'N/A',
    },
  ]);
}

function extractEpisodes(html) {
  const episodes = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const episodeElements = doc.querySelectorAll('.episode');

  episodeElements.forEach((episodeElement, index) => {
    const linkElement = episodeElement.querySelector('a');
    if (linkElement) {
      episodes.push({
        href: linkElement.href,
        number: index + 1,
      });
    }
  });

  return episodes;
}

async function extractStreamUrl(url) {
  const response = await fetchv2(url);
  const html = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const iframeElement = doc.querySelector('iframe');
  if (iframeElement && iframeElement.src) {
    return iframeElement.src;
  }

  return null;
}
