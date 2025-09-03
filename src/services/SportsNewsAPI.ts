interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface TransferNews {
  id: string;
  player: string;
  fromTeam: string;
  toTeam: string;
  amount: string;
  date: string;
  status: 'rumor' | 'confirmed' | 'official';
  source: string;
}

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  competition: string;
  status: 'scheduled' | 'live' | 'finished';
  score?: {
    home: number;
    away: number;
  };
}

class SportsNewsAPI {
  private readonly NEWS_API_KEY = 'YOUR_NEWS_API_KEY'; // Reemplazar con API key real
  private readonly FOOTBALL_API_KEY = 'YOUR_FOOTBALL_API_KEY'; // Reemplazar con API key real

  async getTeamNews(teamNames: string[]): Promise<NewsArticle[]> {
    try {
      // Usar NewsAPI para obtener noticias reales de deportes
      const teamQuery = teamNames.join(' OR ');
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(teamQuery + ' football soccer')}&language=es&sortBy=publishedAt&apiKey=${this.NEWS_API_KEY}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        return data.articles
          .filter((article: any) => article.urlToImage && article.description)
          .map((article: any, index: number) => ({
            id: `news_${index}`,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source
          }))
          .slice(0, 10); // Limitar a 10 noticias
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching news:', error);
      // Fallback con noticias de ejemplo si falla la API
      return this.getFallbackNews(teamNames);
    }
  }

  async getTransferNews(teamNames: string[]): Promise<TransferNews[]> {
    try {
      // Usar API de transferencias (ejemplo con Football-Data.org)
      const transfers: TransferNews[] = [];
      
      for (const team of teamNames) {
        const url = `https://api.football-data.org/v4/teams/search?name=${encodeURIComponent(team)}`;
        const response = await fetch(url, {
          headers: {
            'X-Auth-Token': this.FOOTBALL_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Procesar datos de transferencias reales aquí
        }
      }
      
      return transfers;
    } catch (error) {
      console.error('Error fetching transfers:', error);
      return this.getFallbackTransfers(teamNames);
    }
  }

  async getTeamMatches(teamNames: string[]): Promise<Match[]> {
    try {
      // Usar API de partidos reales
      const matches: Match[] = [];
      
      for (const team of teamNames) {
        const url = `https://api.football-data.org/v4/teams/search?name=${encodeURIComponent(team)}`;
        const response = await fetch(url, {
          headers: {
            'X-Auth-Token': this.FOOTBALL_API_KEY
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          // Procesar partidos reales aquí
        }
      }
      
      return matches;
    } catch (error) {
      console.error('Error fetching matches:', error);
      return this.getFallbackMatches(teamNames);
    }
  }

  private getFallbackNews(teamNames: string[]): NewsArticle[] {
    // Datos de ejemplo solo para desarrollo - reemplazar con API real
    return [
      {
        id: '1',
        title: 'Configurar API de noticias reales',
        description: 'Para obtener noticias reales, configura tu API key de NewsAPI en SportsNewsAPI.ts',
        url: 'https://newsapi.org',
        urlToImage: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
        publishedAt: new Date().toISOString(),
        source: { name: 'Sistema' }
      }
    ];
  }

  private getFallbackTransfers(teamNames: string[]): TransferNews[] {
    return [
      {
        id: '1',
        player: 'Configurar API',
        fromTeam: 'Desarrollo',
        toTeam: 'Producción',
        amount: 'API Key',
        date: new Date().toISOString(),
        status: 'official',
        source: 'Sistema'
      }
    ];
  }

  private getFallbackMatches(teamNames: string[]): Match[] {
    return [
      {
        id: '1',
        homeTeam: 'Configurar',
        awayTeam: 'API Real',
        date: new Date(Date.now() + 86400000).toISOString(),
        competition: 'Desarrollo',
        status: 'scheduled'
      }
    ];
  }
}

export default new SportsNewsAPI();