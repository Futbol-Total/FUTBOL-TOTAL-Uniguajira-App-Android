import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Team } from '../services/TeamsService';

interface FavoritesContextType {
  favoriteTeams: Team[];
  addFavoriteTeam: (team: Team) => Promise<void>;
  removeFavoriteTeam: (teamId: string) => Promise<void>;
  isFavorite: (teamId: string) => boolean;
  loading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@futbol_total_favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteTeams, setFavoriteTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavoriteTeams(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFavorites = async (teams: Team[]) => {
    try {
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(teams));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const addFavoriteTeam = async (team: Team) => {
    const newFavorites = [...favoriteTeams, team];
    setFavoriteTeams(newFavorites);
    await saveFavorites(newFavorites);
  };

  const removeFavoriteTeam = async (teamId: string) => {
    const newFavorites = favoriteTeams.filter(team => team.id !== teamId);
    setFavoriteTeams(newFavorites);
    await saveFavorites(newFavorites);
  };

  const isFavorite = (teamId: string) => {
    return favoriteTeams.some(team => team.id === teamId);
  };

  const value = {
    favoriteTeams,
    addFavoriteTeam,
    removeFavoriteTeam,
    isFavorite,
    loading
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}