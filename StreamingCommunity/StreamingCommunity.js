const puppeteer = require('puppeteer');

async function scrapeSearchResults(searchQuery) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    // Apri la pagina principale
    await page.goto('https://streamingcommunity.hiphop/', { waitUntil: 'networkidle2' });

    // Aspetta che l'icona di ricerca sia disponibile e cliccala
    await page.waitForSelector('.nav-right .nav-item.search-bar-item .search-bar .search-icon', { timeout: 5000 });
    await page.click('.nav-right .nav-item.search-bar-item .search-bar .search-icon');

    // Aspetta la barra di ricerca
    await page.waitForSelector('input[placeholder="Cerca titolo"]', { timeout: 5000 });

    // Scrivi il titolo nella barra di ricerca
    await page.type('input[placeholder="Cerca titolo"]', searchQuery, { delay: 100 });

    // Premi Invio
    await page.keyboard.press('Enter');

    // Attendi il caricamento dei risultati
    await new Promise(resolve => setTimeout(resolve, 3000)); // Alternativa a waitForTimeout

    // Estrai i risultati della ricerca
    const results = await page.evaluate(() => {
        const items = [];
        document.querySelectorAll('.slider-item').forEach(item => {
            const titleElement = item.querySelector('a');
            const imageElement = item.querySelector('img');

            const title = titleElement ? titleElement.innerText : 'Titolo non trovato';
            const link = titleElement ? titleElement.href : 'Link non disponibile';
            const image = imageElement ? imageElement.src : 'Immagine non disponibile';

            items.push({ title, link, image });
        });
        return items;
    });

    console.log('Risultati della ricerca:', results);

    // Per ogni show trovato, estrai i dettagli
    for (const result of results) {
        const details = await scrapeShowDetails(browser, result.link, result.title);
        console.log('Dettagli Show:', details);
    }

    await browser.close();
}

async function scrapeShowDetails(browser, showUrl, title) {
    const page = await browser.newPage();
    await page.goto(showUrl, { waitUntil: 'networkidle2' });

    try {
        await page.waitForSelector('app[style] overview-tab overview plot p', { timeout: 60000 });

        const details = await page.evaluate(() => {
            const description = document.querySelector('app[style] overview-tab overview plot p')?.innerText || 'Descrizione non trovata';
            const airdate = document.querySelector('app[style] overview-tab overview .info-bar span:last-child')?.innerText.trim() || 'Anno non disponibile';

            return {
                description: description,
                alias: title, // Utilizziamo il titolo come alias per ora
                airdate: airdate
            };
        });

        await page.close();
        return details;
    } catch (error) {
        console.error('Errore durante l\'estrazione dei dettagli:', error);
        return {
            description: 'Errore nel recupero della descrizione',
            alias: title,
            airdate: 'Anno non disponibile'
        };
    }
}

// Esegui la ricerca per un titolo specifico
scrapeSearchResults('mickey');
