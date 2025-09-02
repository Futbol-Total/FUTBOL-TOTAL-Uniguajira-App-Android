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
}

class NewsService {
  private readonly NEWS_API_KEY = 'demo'; // En producción usar API key real
  private readonly SPORT_API_BASE = 'https://api.football-data.org/v4';

  async getTeamNews(teamNames: string[]): Promise<NewsArticle[]> {
    try {
      // Usar múltiples fuentes de noticias deportivas
      const sources = [
        'espn',
        'marca',
        'as',
        'sport',
        'mundo-deportivo',
        'ole',
        'tyc-sports'
      ];

      const teamQuery = teamNames.join(' OR ');
      
      // Simular llamada a API real - en producción usar NewsAPI o similar
      const mockNews: NewsArticle[] = [
        {
          id: '1',
          title: 'Real Madrid prepara oferta por Mbappé',
          description: 'El club blanco estaría dispuesto a pagar 200 millones por el delantero francés',
          url: 'https://www.marca.com/futbol/real-madrid/2024/01/15/news.html',
          urlToImage: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg',
          publishedAt: new Date().toISOString(),
          source: { name: 'Marca' }
        },
        {
          id: '2',
          title: 'Barcelona renueva a Pedri hasta 2030',
          description: 'El centrocampista español firma su renovación con cláusula de 1000 millones',
          url: 'https://www.sport.es/es/noticias/barca/2024/01/15/news.html',
          urlToImage: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Sport' }
        },
        {
          id: '3',
          title: 'Selección Colombia convoca a James Rodríguez',
          description: 'El mediocampista regresa a la selección para los próximos partidos eliminatorias',
          url: 'https://www.ole.com.ar/seleccion-colombia/2024/01/15/news.html',
          urlToImage: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'Olé' }
        }
      ];

      // Filtrar noticias por equipos seleccionados
      return mockNews.filter(article => 
        teamNames.some(team => 
          article.title.toLowerCase().includes(team.toLowerCase()) ||
          article.description.toLowerCase().includes(team.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Error fetching news:', error);
      return [];
    }
  }

  async getTransferNews(teamNames: string[]): Promise<TransferNews[]> {
    try {
      // Simular datos de transferencias reales - en producción conectar con API de Fabrizio Romano
      const mockTransfers: TransferNews[] = [
        {
          id: '1',
          player: 'Kylian Mbappé',
          fromTeam: 'PSG',
          toTeam: 'Real Madrid',
          amount: '€200M',
          date: new Date().toISOString(),
          status: 'rumor'
        },
        {
          id: '2',
          player: 'Erling Haaland',
          fromTeam: 'Manchester City',
          toTeam: 'Real Madrid',
          amount: '€150M',
          date: new Date(Date.now() - 86400000).toISOString(),
          status: 'rumor'
        },
        {
          id: '3',
          player: 'Luis Díaz',
          fromTeam: 'Liverpool',
          toTeam: 'Barcelona',
          amount: '€80M',
          date: new Date(Date.now() - 172800000).toISOString(),
          status: 'confirmed'
        }
      ];

      return mockTransfers.filter(transfer => 
        teamNames.some(team => 
          transfer.fromTeam.toLowerCase().includes(team.toLowerCase()) ||
          transfer.toTeam.toLowerCase().includes(team.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Error fetching transfers:', error);
      return [];
    }
  }

  async getTeamMatches(teamNames: string[]): Promise<any[]> {
    try {
      // En producción conectar con API real de partidos
      const mockMatches = [
        {
          id: '1',
          homeTeam: 'Real Madrid',
          awayTeam: 'Barcelona',
          date: new Date(Date.now() + 86400000).toISOString(),
          competition: 'La Liga',
          status: 'scheduled'
        },
        {
          id: '2',
          homeTeam: 'Colombia',
          awayTeam: 'Argentina',
          date: new Date(Date.now() + 172800000).toISOString(),
          competition: 'Eliminatorias',
          status: 'scheduled'
        }
      ];

      return mockMatches.filter(match => 
        teamNames.some(team => 
          match.homeTeam.toLowerCase().includes(team.toLowerCase()) ||
          match.awayTeam.toLowerCase().includes(team.toLowerCase())
        )
      );
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }
}

export default new NewsService();