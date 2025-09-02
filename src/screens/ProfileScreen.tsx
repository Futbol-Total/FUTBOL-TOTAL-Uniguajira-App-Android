import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { FlatGrid } from 'react-native-super-grid';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import TeamsService, { Team } from '../services/TeamsService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { favoriteTeams, addFavoriteTeam, removeFavoriteTeam, isFavorite } = useFavorites();
  const [userStats, setUserStats] = useState({
    memberSince: 'Cargando...',
    lastLogin: 'Cargando...',
  });
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  useEffect(() => {
    if (user) {
      const creationTime = user.metadata?.creationTime;
      const lastSignInTime = user.metadata?.lastSignInTime;
      
      let memberSince = 'Información no disponible';
      if (creationTime) {
        memberSince = new Date(creationTime).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long'
        });
      }
      
      let lastLogin = 'Información no disponible';
      if (lastSignInTime) {
        const lastLoginDate = new Date(lastSignInTime);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - lastLoginDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          lastLogin = 'Hoy';
        } else if (diffDays === 2) {
          lastLogin = 'Ayer';
        } else if (diffDays <= 7) {
          lastLogin = `Hace ${diffDays - 1} días`;
        } else {
          lastLogin = lastLoginDate.toLocaleDateString('es-ES');
        }
      }
      
      setUserStats({ memberSince, lastLogin });
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim()) {
      setFilteredTeams(TeamsService.searchTeams(searchQuery));
    } else {
      setFilteredTeams(TeamsService.getAllTeams());
    }
  }, [searchQuery]);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (error: any) {
              Alert.alert('Error', 'No se pudo cerrar la sesión');
            }
          }
        },
      ]
    );
  };

  const handleTeamToggle = async (team: Team) => {
    if (isFavorite(team.id)) {
      await removeFavoriteTeam(team.id);
    } else {
      await addFavoriteTeam(team);
    }
  };

  const getUserName = (email: string) => {
    return email.split('@')[0];
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.avatar}
          />
          <Text style={styles.userName}>
            {user?.email ? getUserName(user.email) : 'Usuario'}
          </Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="mail" size={20} color="#68cc8f" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="calendar" size={20} color="#68cc8f" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Miembro Desde</Text>
              <Text style={styles.infoValue}>{userStats.memberSince}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time" size={20} color="#68cc8f" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Último Acceso</Text>
              <Text style={styles.infoValue}>{userStats.lastLogin}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="heart" size={20} color="#68cc8f" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Equipos Favoritos</Text>
              <Text style={styles.infoValue}>{favoriteTeams.length} equipos</Text>
            </View>
          </View>
        </View>

        {/* Equipos Favoritos */}
        <View style={styles.favoritesSection}>
          <View style={styles.favoritesHeader}>
            <Text style={styles.sectionTitle}>Equipos Favoritos</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowTeamSelector(true)}
            >
              <Ionicons name="add" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {favoriteTeams.length > 0 ? (
            <View style={styles.favoritesList}>
              {favoriteTeams.map((team) => (
                <View key={team.id} style={styles.favoriteTeamCard}>
                  <Text style={styles.teamEmoji}>{team.logo}</Text>
                  <View style={styles.favoriteTeamInfo}>
                    <Text style={styles.favoriteTeamName}>{team.name}</Text>
                    <Text style={styles.favoriteTeamLeague}>{team.league}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removeFavoriteTeam(team.id)}
                    style={styles.removeButton}
                  >
                    <Ionicons name="close" size={16} color="#ff4757" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <Text style={styles.noFavoritesText}>
              No tienes equipos favoritos. Toca + para agregar.
            </Text>
          )}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="#ffffff" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de selección de equipos */}
      <Modal
        visible={showTeamSelector}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowTeamSelector(false)}>
              <Ionicons name="close" size={24} color="#68cc8f" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Seleccionar Equipos</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.6)" />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar equipos..."
              placeholderTextColor="rgba(255, 255, 255, 0.6)"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatGrid
            itemDimension={130}
            data={filteredTeams}
            style={styles.teamGrid}
            spacing={10}
            renderItem={({ item: team }) => (
              <TouchableOpacity
                style={[
                  styles.teamSelectorCard,
                  isFavorite(team.id) && styles.teamSelectorCardSelected
                ]}
                onPress={() => handleTeamToggle(team)}
              >
                <Text style={styles.teamSelectorEmoji}>{team.logo}</Text>
                <Text style={styles.teamSelectorName} numberOfLines={2}>
                  {team.name}
                </Text>
                <Text style={styles.teamSelectorLeague} numberOfLines={1}>
                  {team.league}
                </Text>
                {isFavorite(team.id) && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark" size={16} color="#ffffff" />
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  banner: {
    backgroundColor: '#0c0c1f',
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(104, 204, 143, 0.2)',
  },
  bannerLogo: {
    width: 120,
    height: 40,
  },
  content: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#68cc8f',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoContainer: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 15,
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoContent: {
    marginLeft: 15,
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  favoritesSection: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 15,
    padding: 20,
  },
  favoritesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#68cc8f',
  },
  addButton: {
    backgroundColor: '#68cc8f',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoritesList: {
    gap: 10,
  },
  favoriteTeamCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 12,
    borderRadius: 10,
  },
  teamEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  favoriteTeamInfo: {
    flex: 1,
  },
  favoriteTeamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favoriteTeamLeague: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  removeButton: {
    padding: 8,
  },
  noFavoritesText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff4757',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#ff4757',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#68cc8f',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    padding: 15,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 16,
  },
  teamGrid: {
    flex: 1,
    paddingHorizontal: 15,
  },
  teamSelectorCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  teamSelectorCardSelected: {
    borderColor: '#68cc8f',
    backgroundColor: 'rgba(104, 204, 143, 0.1)',
  },
  teamSelectorEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  teamSelectorName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 4,
  },
  teamSelectorLeague: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#68cc8f',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});