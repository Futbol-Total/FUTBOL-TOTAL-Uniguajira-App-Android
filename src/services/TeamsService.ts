export interface Team {
  id: string;
  name: string;
  logo: string;
  country: string;
  league: string;
  type: 'club' | 'national';
}

class TeamsService {
  private teams: Team[] = [
    // Equipos colombianos
    { id: 'millonarios', name: 'Millonarios', logo: '🔵', country: 'Colombia', league: 'Liga BetPlay', type: 'club' },
    { id: 'nacional', name: 'Atlético Nacional', logo: '🟢', country: 'Colombia', league: 'Liga BetPlay', type: 'club' },
    { id: 'america', name: 'América de Cali', logo: '🔴', country: 'Colombia', league: 'Liga BetPlay', type: 'club' },
    { id: 'santa-fe', name: 'Independiente Santa Fe', logo: '🔴', country: 'Colombia', league: 'Liga BetPlay', type: 'club' },
    { id: 'junior', name: 'Junior de Barranquilla', logo: '🔴', country: 'Colombia', league: 'Liga BetPlay', type: 'club' },
    
    // Selecciones
    { id: 'colombia', name: 'Selección Colombia', logo: '🇨🇴', country: 'Colombia', league: 'CONMEBOL', type: 'national' },
    { id: 'argentina', name: 'Selección Argentina', logo: '🇦🇷', country: 'Argentina', league: 'CONMEBOL', type: 'national' },
    { id: 'brasil', name: 'Selección Brasil', logo: '🇧🇷', country: 'Brasil', league: 'CONMEBOL', type: 'national' },
    { id: 'espana', name: 'Selección España', logo: '🇪🇸', country: 'España', league: 'UEFA', type: 'national' },
    
    // Equipos europeos principales
    { id: 'real-madrid', name: 'Real Madrid', logo: '⚪', country: 'España', league: 'La Liga', type: 'club' },
    { id: 'barcelona', name: 'FC Barcelona', logo: '🔵', country: 'España', league: 'La Liga', type: 'club' },
    { id: 'atletico', name: 'Atlético Madrid', logo: '🔴', country: 'España', league: 'La Liga', type: 'club' },
    { id: 'manchester-city', name: 'Manchester City', logo: '🔵', country: 'Inglaterra', league: 'Premier League', type: 'club' },
    { id: 'manchester-united', name: 'Manchester United', logo: '🔴', country: 'Inglaterra', league: 'Premier League', type: 'club' },
    { id: 'liverpool', name: 'Liverpool', logo: '🔴', country: 'Inglaterra', league: 'Premier League', type: 'club' },
    { id: 'chelsea', name: 'Chelsea', logo: '🔵', country: 'Inglaterra', league: 'Premier League', type: 'club' },
    { id: 'arsenal', name: 'Arsenal', logo: '🔴', country: 'Inglaterra', league: 'Premier League', type: 'club' },
    { id: 'psg', name: 'Paris Saint-Germain', logo: '🔵', country: 'Francia', league: 'Ligue 1', type: 'club' },
    { id: 'bayern', name: 'Bayern Munich', logo: '🔴', country: 'Alemania', league: 'Bundesliga', type: 'club' },
    { id: 'juventus', name: 'Juventus', logo: '⚫', country: 'Italia', league: 'Serie A', type: 'club' },
    { id: 'milan', name: 'AC Milan', logo: '🔴', country: 'Italia', league: 'Serie A', type: 'club' },
    { id: 'inter', name: 'Inter Milan', logo: '🔵', country: 'Italia', league: 'Serie A', type: 'club' },
  ];

  getAllTeams(): Team[] {
    return this.teams;
  }

  getTeamsByType(type: 'club' | 'national'): Team[] {
    return this.teams.filter(team => team.type === type);
  }

  getTeamsByLeague(league: string): Team[] {
    return this.teams.filter(team => team.league === league);
  }

  getTeamById(id: string): Team | undefined {
    return this.teams.find(team => team.id === id);
  }

  searchTeams(query: string): Team[] {
    const lowercaseQuery = query.toLowerCase();
    return this.teams.filter(team => 
      team.name.toLowerCase().includes(lowercaseQuery) ||
      team.league.toLowerCase().includes(lowercaseQuery) ||
      team.country.toLowerCase().includes(lowercaseQuery)
    );
  }
}

export default new TeamsService();