import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import WebViewWidget from '../components/WebViewWidget';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <Text style={styles.title}>Futbol Total</Text>
        <TouchableOpacity style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#68cc8f" />
        </TouchableOpacity>
      </View>

      {/* Widget que ocupa toda la pantalla disponible */}
      <View style={styles.widgetContainer}>
        <WebViewWidget />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#0c0c1f',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(104, 204, 143, 0.2)',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#68cc8f',
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(104, 204, 143, 0.1)',
  },
  widgetContainer: {
    flex: 1,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
});