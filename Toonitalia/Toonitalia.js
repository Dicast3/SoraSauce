// Definizione del file JSON con la configurazione
const config = {
    "sourceName": "TOONITALIA",
    "iconUrl": "xxx",
    "author": {
        "name": "DxC",
        "icon": "xxx"
    },
    "version": "0.0.1",
    "language": "Italian",
    "streamType": "HLS",
    "quality": "720p",
    "baseUrl": "https://toonitalia.xyz/wp-json/",
    "searchBaseUrl": "https://toonitalia.xyz/wp-json/wp/v2/posts?search=%s",
    "scriptUrl": "xxx.js",
    "asyncJS": true
};


// Funzione per estrarre i dettagli del contenuto
function extractContentDetails(postData) {
    const contentDetails = {
        title: postData.title.rendered || 'N/A',
        originalTitle: (postData.content.rendered.match(/Titolo originale.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        alternativeTitles: (postData.content.rendered.match(/Titoli alternativi.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        country: (postData.content.rendered.match(/Paese di origine.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        publicationDate: (postData.content.rendered.match(/Data di pubblicazione.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        episodes: (postData.content.rendered.match(/N. Episodi.*?:\s*(\d+)/)?.[1]) || 'N/A',
        status: (postData.content.rendered.match(/Stato Opera.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        streamingUpdate: (postData.content.rendered.match(/Aggiornamento episodi in streaming.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        plot: (postData.content.rendered.match(/Trama.*?:\s*([^<]+)<br/)?.[1]) || 'N/A',
        sourceLink: (postData.content.rendered.match(/Fonte:.*?<a href="([^"]+)"/)?.[1]) || 'N/A'
    };

    return contentDetails;
}

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
