import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WebViewWidget from '../components/WebViewWidget';

export default function MatchesScreen() {
  return (
    </SafeAreaView>
      <WebViewWidget url="https://futbol-total.uniguajira.com/partidos" />
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
});