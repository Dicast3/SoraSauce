async function searchResults(keyword) {
  // Simulazione: ritorna una lista "fake" con un solo risultato
  const results = [
    {
      title: "My Hero Academia: You're Next",
      image: "https://dummyimage.com/300x450/000/fff&text=MHA",
      href: "https://raw.githubusercontent.com/Dicast3/SoraSauce/refs/heads/main/Altadefinizione/Altadefinizione.json",
    },
  ];

  return JSON.stringify(results);
}

async function extractDetails(url) {
  // Simulazione: ritorna i dettagli fake
  return JSON.stringify([
    {
      description:
        "In una società in cui eroi e cattivi si scontrano continuamente in nome della pace e del caos, Deku, uno studente della U.A. High School che aspira a diventare il miglior eroe possibile, affronta il ...  Leggi tutto",
      aliases: "N/A",
      airdate: "N/A",
    },
  ]);
}

function extractEpisodes(html) {
  // Simulazione: ritorna una lista con un solo episodio fasullo
  return [
    {
      href: "https://raw.githubusercontent.com/Dicast3/SoraSauce/refs/heads/main/Altadefinizione/Altadefinizione.json",
      number: 1,
    },
  ];
}

async function extractStreamUrl(url) {
  // Simulazione: ritorna un link blob finto
  return "blob:https://supervideo.cc/9595a9e5-2099-4fa3-b860-8bfafbc6d6cd";
}
