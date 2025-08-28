import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import WebViewWidget from '../components/WebViewWidget';

export default function MatchesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Todos los Partidos</Text>
          <Text style={styles.subtitle}>Resultados en tiempo real</Text>
        </View>
        
        <View style={styles.widgetContainer}>
          <WebViewWidget />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#68cc8f',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  widgetContainer: {
    flex: 1,
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
  },
});