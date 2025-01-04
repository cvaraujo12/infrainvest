export const countrySearchEngines = {
  BR: {
    name: "Brazil",
    engines: [
      { id: "google-br", name: "Google Brasil", url: "https://www.google.com.br/search?q=" },
      { id: "bing-br", name: "Bing Brasil", url: "https://www.bing.com/search?setlang=pt-BR&q=" },
      { id: "yahoo-br", name: "Yahoo Brasil", url: "https://br.search.yahoo.com/search?p=" },
      { id: "ask-br", name: "Ask Brasil", url: "https://br.ask.com/web?q=" },
      { id: "uol", name: "UOL Busca", url: "https://busca.uol.com.br/web/?q=" },
    ]
  },
  MX: {
    name: "Mexico",
    engines: [
      { id: "google-mx", name: "Google México", url: "https://www.google.com.mx/search?q=" },
      { id: "bing-mx", name: "Bing México", url: "https://www.bing.com/search?setlang=es-MX&q=" },
      { id: "yahoo-mx", name: "Yahoo México", url: "https://mx.search.yahoo.com/search?p=" },
      { id: "ask-mx", name: "Ask México", url: "https://mx.ask.com/web?q=" },
    ]
  },
  AR: {
    name: "Argentina",
    engines: [
      { id: "google-ar", name: "Google Argentina", url: "https://www.google.com.ar/search?q=" },
      { id: "bing-ar", name: "Bing Argentina", url: "https://www.bing.com/search?setlang=es-AR&q=" },
      { id: "yahoo-ar", name: "Yahoo Argentina", url: "https://ar.search.yahoo.com/search?p=" },
      { id: "ask-ar", name: "Ask Argentina", url: "https://ar.ask.com/web?q=" },
    ]
  },
  // Add more countries as needed
};

export const defaultCountry = "BR";

export function detectUserCountry() {
  // This would typically use the browser's language or a geolocation service
  // For now, we'll return the default country
  return defaultCountry;
}

export function getSearchUrl(engineId, query) {
  for (const country of Object.values(countrySearchEngines)) {
    const engine = country.engines.find(e => e.id === engineId);
    if (engine) {
      return engine.url + encodeURIComponent(query);
    }
  }
  // Default to Google Brazil if engine not found
  return countrySearchEngines.BR.engines[0].url + encodeURIComponent(query);
}