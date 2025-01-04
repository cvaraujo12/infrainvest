import axios from 'axios';
import { countrySearchEngines } from './search-engines';

export const CACHE_KEY = 'infrastructure_investment_cache';
export const LAST_UPDATE_KEY = 'last_investment_update';

export async function extractInvestmentData(htmlContent) {
  // Simple extraction logic - in production this would be more sophisticated
  const investmentPattern = /\$\s*\d+(?:\.\d+)?\s*(?:million|billion)/gi;
  const matches = htmlContent.match(investmentPattern) || [];
  
  return matches.map(match => {
    const amount = parseFloat(match.replace(/[^\d.]/g, ''));
    const multiplier = match.toLowerCase().includes('billion') ? 1000000000 : 1000000;
    return amount * multiplier;
  });
}

export async function searchInvestment(query, engine) {
  try {
    const response = await axios.get(engine.url + encodeURIComponent(query), {
      headers: {
        'User-Agent': 'InfraInvest Research Bot/1.0',
      },
    });
    return await extractInvestmentData(response.data);
  } catch (error) {
    console.error(`Search failed for ${engine.name}:`, error);
    return [];
  }
}

export async function updateInvestmentData() {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const updates = [];

  for (const [countryCode, country] of Object.entries(countrySearchEngines)) {
    for (const engine of country.engines) {
      const searchQueries = [
        'new infrastructure investment',
        'infrastructure project announcement',
        'major construction project',
        'infrastructure development',
      ];

      for (const query of searchQueries) {
        const results = await searchInvestment(query, engine);
        if (results.length > 0) {
          updates.push({
            country: countryCode,
            engine: engine.id,
            timestamp: Date.now(),
            results,
          });
        }
      }
    }
  }

  // Update cache with new data
  cache.updates = [...(cache.updates || []), ...updates];
  cache.lastUpdate = Date.now();
  
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());

  return updates;
}