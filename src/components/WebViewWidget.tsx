import React, { useRef } from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { WebView } from 'react-native-webview';

interface WebViewWidgetProps {
  url?: string;
}

export default function WebViewWidget({ url = 'https://futbol-total.uniguajira.com' }: WebViewWidgetProps) {
  const webViewRef = useRef<WebView>(null);

  return (
    <View style={styles.container}>
      <View style={styles.bannerContainer}>
        <Image
          source={require('../../img/logo_3-removebg-preview.png')}
          style={styles.bannerLogo}
          resizeMode="contain"
        />
      </View>
      <WebView
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={false}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={true}
        allowsInlineMediaPlaybook={true}
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        thirdPartyCookiesEnabled={true}
        sharedCookiesEnabled={true}
        originWhitelist={['*']}
        bounces={false}
        overScrollMode="always"
        contentInsetAdjustmentBehavior="automatic"
        setSupportMultipleWindows={false}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onLoadStart={() => console.log('Widget cargando...')}
        onLoadEnd={() => console.log('Widget cargado')}
        onError={(error) => console.log('Error en widget:', error)}
        injectedJavaScript={`
          // Ajustar el viewport para móvil
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
          document.getElementsByTagName('head')[0].appendChild(meta);
          
          // Prevenir zoom accidental
          document.addEventListener('gesturestart', function (e) {
            e.preventDefault();
          });
          
          true; // Requerido para que funcione el injectedJavaScript
        `}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
  bannerContainer: {
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
  webview: {
    flex: 1,
    backgroundColor: '#0c0c1f',
  },
});