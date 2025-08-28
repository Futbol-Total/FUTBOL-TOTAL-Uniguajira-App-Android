import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebViewWidget from '../components/WebViewWidget';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const leagues = [
    { name: 'La Liga', image: 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { name: 'Premier League', image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { name: 'Serie A', image: 'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
    { name: 'Bundesliga', image: 'https://images.pexels.com/photos/1171084/pexels-photo-1171084.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop' },
  ];

  const news = [
    {
      title: 'Título de la noticia',
      summary: 'Resumen de la noticia deportiva...',
      time: 'Hace 2 horas',
      image: 'https://images.pexels.com/photos/46798/the-ball-stadion-football-the-pitch-46798.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
    },
    {
      title: 'Otra noticia importante',
      summary: 'Más información deportiva relevante...',
      time: 'Hace 4 horas',
      image: 'https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop'
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Widget de partidos en vivo */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            <Ionicons name="football" size={20} color="#68cc8f" /> Partidos de Hoy
          </Text>
          <TouchableOpacity style={styles.refreshButton}>
            <Ionicons name="refresh" size={20} color="#68cc8f" />
          </TouchableOpacity>
        </View>
        <WebViewWidget />
      </View>

      {/* Ligas principales */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="trophy" size={20} color="#68cc8f" /> Ligas Principales
        </Text>
        <View style={styles.leaguesGrid}>
          {leagues.map((league, index) => (
            <TouchableOpacity key={index} style={styles.leagueItem}>
              <Image source={{ uri: league.image }} style={styles.leagueImage} />
              <Text style={styles.leagueName}>{league.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Noticias destacadas */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          <Ionicons name="newspaper" size={20} color="#68cc8f" /> Noticias Destacadas
        </Text>
        {news.map((item, index) => (
          <TouchableOpacity key={index} style={styles.newsItem}>
            <Image source={{ uri: item.image }} style={styles.newsImage} />
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{item.title}</Text>
              <Text style={styles.newsSummary}>{item.summary}</Text>
              <Text style={styles.newsTime}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  card: {
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 15,
  },
  refreshButton: {
    padding: 5,
  },
  leaguesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  leagueItem: {
    width: (width - 80) / 2,
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  leagueImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  leagueName: {
    color: '#ffffff',
    fontSize: 12,
    textAlign: 'center',
  },
  newsItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  newsImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginBottom: 5,
  },
  newsSummary: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 5,
  },
  newsTime: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
  },
});