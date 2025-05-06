async function searchResults(keyword) {
  const searchUrl = `http://ovovideo.com/search?q=${encodeURIComponent(keyword)}`;
  const response = await fetch(searchUrl);
  const html = await response.text();

  // Utilizza un parser DOM per analizzare l'HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Seleziona gli elementi che rappresentano i risultati della ricerca
  const resultElements = doc.querySelectorAll('.search-result-item'); // Modifica il selettore in base alla struttura del sito

  const results = Array.from(resultElements).map((element) => {
    const titleElement = element.querySelector('.title'); // Modifica il selettore in base alla struttura del sito
    const linkElement = element.querySelector('a'); // Modifica il selettore in base alla struttura del sito
    const imageElement = element.querySelector('img'); // Modifica il selettore in base alla struttura del sito

    return {
      title: titleElement ? titleElement.textContent.trim() : 'Titolo non disponibile',
      href: linkElement ? linkElement.href : '#',
      image: imageElement ? imageElement.src : null,
    };
  });

  return results;
}
