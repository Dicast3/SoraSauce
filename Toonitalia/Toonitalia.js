// Definizione del file JSON con la configurazione
const config = {
    "baseUrl": "https://toonitalia.xyz/wp-json/",
    "searchBaseUrl": "https://toonitalia.xyz/wp-json/wp/v2/posts?search=%s",
};


// Funzione per estrarre solo il titolo, l'immagine e il link del post
function extractContentDetails(postData) {
    const contentDetails = {
        title: postData.title.rendered || 'N/A', // Titolo dello show
        image: extractImage(postData.content.rendered), // Link dell'immagine (la locandina)
        link: postData.link || 'N/A' // Link del post
    };

    return contentDetails;
}

// Funzione per estrarre l'immagine (la locandina) dal contenuto HTML
function extractImage(htmlContent) {
    const imgRegex = /<img[^>]+src="([^"]+)"/; // Regex per trovare l'URL dell'immagine
    const match = htmlContent.match(imgRegex);
    return match ? match[1] : 'Immagine non trovata'; // Restituisce il link dell'immagine o un messaggio se non trovata
}

async function getAnimeData() {
    const apiUrl = "https://toonitalia.xyz/wp-json/wp/v2/posts"; // URL dell'API

    try {
        const response = await fetch(apiUrl); // Chiediamo i dati all'API
        const data = await response.json(); // Li convertiamo in formato JSON

        // Estrarremo solo i dettagli di interesse (titolo, immagine e link)
        const results = data.map(post => {
            return extractContentDetails(post); // Restituiamo solo i dettagli necessari
        });

        console.log(results); // Mostriamo i risultati in console
    } catch (error) {
        console.error("Errore nel recuperare i dati:", error); // Gestione degli errori
    }
}

getAnimeData(); // Chiamata alla funzione

// Funzione per cercare i contenuti tramite l'API
async function searchContent(query) {
    const searchUrl = config.searchBaseUrl.replace("%s", encodeURIComponent(query));

    try {
        const response = await fetch(searchUrl);
        
        // Verifica che la risposta sia in formato JSON
        if (response.headers.get("content-type") && response.headers.get("content-type").includes("application/json")) {
            const data = await response.json();
            return data;
        } else {
            const text = await response.text();
            console.log("Risposta non JSON:", text); // Stampa il contenuto della risposta
            return [];
        }
    } catch (error) {
        console.error("Errore durante la ricerca dei contenuti:", error);
        return [];
    }
}

// Funzione per ottenere i dettagli del contenuto
async function getContentDetails(postId) {
    const postUrl = `${config.baseUrl}wp/v2/posts/${postId}`;

    try {
        const response = await fetch(postUrl);
        
        // Verifica se la risposta è JSON
        if (response.headers.get("content-type") && response.headers.get("content-type").includes("application/json")) {
            const postData = await response.json();
            return postData;
        } else {
            const text = await response.text();
            console.log("Risposta non JSON (HTML o errore):", text); // Stampa il contenuto della risposta
            return null;
        }
    } catch (error) {
        console.error("Errore durante il recupero dei dettagli del contenuto:", error);
        return null;
    }
}

// Funzione per ottenere il flusso (streaming)
async function getStreamUrl(postId) {
    // In base alla configurazione, puoi estrarre il flusso in modo dinamico.
    const postDetails = await getContentDetails(postId);
    if (postDetails && postDetails.streamingUrl) {
        return postDetails.streamingUrl;  // Assumiamo che `streamingUrl` sia presente nei dettagli.
    }

    return null;
}

// Funzione principale per eseguire l'applicazione
async function main() {
    const searchQuery = "nome della serie";  // Inserisci il nome della serie o del contenuto che stai cercando
    const results = await searchContent(searchQuery);

    if (results.length > 0) {
        const firstResult = results[0];  // Supponiamo che il primo risultato sia quello che vogliamo
        console.log("Risultato trovato:", firstResult);

        // Ottenere i dettagli
        const contentDetails = await getContentDetails(firstResult.id);
        if (contentDetails) {
            console.log("Dettagli del contenuto:", contentDetails);
        } else {
            console.log("Dettagli del contenuto non trovati.");
        }

        // Ottenere il link di streaming
        const streamUrl = await getStreamUrl(firstResult.id);
        if (streamUrl) {
            console.log("URL di streaming:", streamUrl);
        } else {
            console.log("URL di streaming non disponibile.");
        }
    } else {
        console.log("Nessun risultato trovato.");
    }
}

main();
