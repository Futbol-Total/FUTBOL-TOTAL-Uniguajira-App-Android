import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFavorites } from '../context/FavoritesContext';
import NewsService from '../services/NewsService';

const { width } = Dimensions.get('window');

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

export default function HomeScreen() {
  const { favoriteTeams } = useFavorites();
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [transfers, setTransfers] = useState<TransferNews[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (favoriteTeams.length > 0) {
      loadTeamData();
    }
  }, [favoriteTeams]);

  const loadTeamData = async () => {
    if (favoriteTeams.length === 0) return;
    
    setLoading(true);
    try {
      const teamNames = favoriteTeams.map(team => team.name);
      const [newsData, transfersData] = await Promise.all([
        NewsService.getTeamNews(teamNames),
        NewsService.getTransferNews(teamNames)
      ]);
      
      setNews(newsData);
      setTransfers(transfersData);
    } catch (error) {
      console.error('Error loading team data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Hace unos minutos';
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffHours < 48) return 'Ayer';
    return date.toLocaleDateString('es-ES');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'official': return '#68cc8f';
      case 'confirmed': return '#ffa726';
      case 'rumor': return '#64b5f6';
      default: return '#64b5f6';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'official': return 'OFICIAL';
      case 'confirmed': return 'CONFIRMADO';
      case 'rumor': return 'RUMOR';
      default: return 'RUMOR';
    }
  };

  if (favoriteTeams.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.banner}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.bannerLogo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={80} color="rgba(255, 255, 255, 0.3)" />
          <Text style={styles.emptyTitle}>Sin equipos favoritos</Text>
          <Text style={styles.emptyText}>
            Ve a tu perfil y selecciona tus equipos favoritos para ver noticias personalizadas
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={loadTeamData} />
        }
      >
        {/* Equipos Favoritos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mis Equipos</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.teamsContainer}>
              {favoriteTeams.map((team) => (
                <View key={team.id} style={styles.teamCard}>
                  <Text style={styles.teamEmoji}>{team.logo}</Text>
                  <Text style={styles.teamName}>{team.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Fichajes y Transferencias */}
        {transfers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fichajes y Rumores</Text>
            {transfers.map((transfer) => (
              <View key={transfer.id} style={styles.transferCard}>
                <View style={styles.transferHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(transfer.status) }]}>
                    <Text style={styles.statusText}>{getStatusText(transfer.status)}</Text>
                  </View>
                  <Text style={styles.transferDate}>{formatDate(transfer.date)}</Text>
                </View>
                <Text style={styles.transferPlayer}>{transfer.player}</Text>
                <View style={styles.transferTeams}>
                  <Text style={styles.transferTeam}>{transfer.fromTeam}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#68cc8f" />
                  <Text style={styles.transferTeam}>{transfer.toTeam}</Text>
                </View>
                <Text style={styles.transferAmount}>{transfer.amount}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Noticias */}
        {news.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Últimas Noticias</Text>
            {news.map((article) => (
              <TouchableOpacity key={article.id} style={styles.newsCard}>
                <Image source={{ uri: article.urlToImage }} style={styles.newsImage} />
                <View style={styles.newsContent}>
                  <Text style={styles.newsTitle} numberOfLines={2}>
                    {article.title}
                  </Text>
                  <Text style={styles.newsDescription} numberOfLines={3}>
                    {article.description}
                  </Text>
                  <View style={styles.newsFooter}>
                    <Text style={styles.newsSource}>{article.source.name}</Text>
                    <Text style={styles.newsDate}>{formatDate(article.publishedAt)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 24,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginBottom: 15,
    paddingHorizontal: 15,
  },
  teamsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 15,
  },
  teamCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginRight: 10,
    minWidth: 80,
  },
  teamEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  teamName: {
    fontSize: 12,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '500',
  },
  transferCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#68cc8f',
  },
  transferHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  transferDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  transferPlayer: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  transferTeams: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  transferTeam: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 8,
  },
  transferAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#68cc8f',
  },
  newsCard: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 180,
  },
  newsContent: {
    padding: 15,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 22,
  },
  newsDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsSource: {
    fontSize: 12,
    color: '#68cc8f',
    fontWeight: '500',
  },
  newsDate: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});